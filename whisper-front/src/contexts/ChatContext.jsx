import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import { mapMessage } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { useWhisperDB } from './WhisperDBContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);// TODO: handle from back
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket(socket);
    const { db } = useWhisperDB();
    const currentChatRef = useRef(currentChat);

    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    const loadMessages = async (id) => {
        try {
            const myMessages = await db.getMessagesForChat(id);
            setMessages(myMessages);
        } catch (error) {
            setMessages([]);
            console.log(error);
        }
    }

    const loadPinnedMessages = async (id) => {
        try {
            const myPinnedMessages = await db.getPinnedMessagesForChat(id);
            setPinnedMessages(myPinnedMessages);
        } catch (error) {
            setPinnedMessages([]);
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentChat) {
            // TODO: handle with back
            loadMessages(currentChat.id);
            loadPinnedMessages(currentChat.id);
        }
        currentChatRef.current = currentChat;
    }, [currentChat]);

    const sendMessage = async (type, content, attachmentPayload = null) => {
        setSending(true);
        const newMessage = {
            chatId: currentChat.id,
            content:content,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            type:type.toUpperCase(),
            sentAt : new Date().toISOString(),
            media: "",
            //extension:"",
            parentMessageId: null,
            forwardedFromUserId: null,
            mentions:[],
            isSecret: false,
            isAnnouncement: false,            
        }

        if (attachmentPayload !== null) {
            //newMessage.file = attachmentPayload.file;
            //newMessage.fileType = attachmentPayload.type;
            //newMessage.blobName = attachmentPayload.blobName;
            // TODO: handle this for media and extension
        }


        const newMessageForBackend = { ...newMessage };
       
        newMessage.senderId = whoAmI.id,
        newMessage.deliveredAt = '';
        newMessage.readAt = '';
        newMessage.deleted = false;
        newMessage.sender = whoAmI.name;
        newMessage.state = 4;
        newMessage.time = new Date();

    
        messagesSocket.sendData(newMessageForBackend);
        setSending(false);
        setMessages((prevMessages) => {
            if (prevMessages) {
                return [newMessage, ...prevMessages];
            }
            return [newMessage];
        });
    };

    const updateParentMessage = (message, relationship) => {
        setParentMessage({ relationship, ...message });
    };

    const clearParentMessage = () => {
        setParentMessage(null);
    };  
    const pinMessage = (messsageId, durtaion) => {
        messagesSocket.pinMessage({
            chatId: currentChat.id,
            messageId: messsageId,
            duration: durtaion,
        });
    }

    const unPinMessage = (messsageId) => {
        messagesSocket.unPinMessage({
            chatId: currentChat.id,
            messageId: messsageId,
        });
    }

    const handleReceiveMessage = async (messageData) => {
        try {
            const activeChat = currentChatRef.current; // Get the latest value of currentChat
            await db.insertMessage({ ...mapMessage(messageData), read: false, delivered: false });
    
            setMessages((prevMessages) => {
                if (activeChat && activeChat.id === messageData.chatId) {
                    const messageIndex = prevMessages.findIndex(
                        (message) => message.sentAt === messageData.sentAt
                    );
    
                    if (messageIndex !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[messageIndex] = { ...mapMessage(messageData) };
                        return updatedMessages;
                    }
                }
                return prevMessages;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handlePinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current; 

            const messagesForChat = await db.getMessagesForChat(pinData.chatId);
            const messageToPin = messagesForChat.find(
                (message) => message.id === pinData.pinnedMessage
            );

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.pinnedMessage} not found in chat ${pinData.chatId}`);
            }

            await db.pinMessage({...pinData, content: messageToPin.content});
            await db.updateMessagesForPinned(pinData.messageId);

            if (activeChat && activeChat.id === pinData.chatId) {
                const messageIndex = messages.findIndex(
                    (message) => message.id === pinData.pinnedMessage
                );
                console.log(messageIndex)
                if (messageIndex !== -1) {
                    const updatedMessages = [...messages];
                    updatedMessages[messageIndex].isPinned = true
                    setMessages(updatedMessages);
                    setPinnedMessages([...pinnedMessages, pinData]);
                }
            }
        
        } catch (error) {
            console.error(error);
        }
    }

    const handleUnpinMessage = (pinData) => {
        const { messageId, chatId } = pinData;
        if (chatId === currentChat.id) {
            const messageIndex = messages.findIndex(
                (message) => message.id === messageId
            );
            if (messageIndex !== -1) {
                const updatedMessages = [...messages];
                updatedMessages[messageIndex].isPinned = false
                setMessages(updatedMessages);
                setPinnedMessages(pinnedMessages.filter((pin) => pin.id !== pinData.id));
            }
        } else {
            // TODO: save to indexedDB
        }
    }

    useEffect(() => {
        messagesSocket.onReceiveMessage(handleReceiveMessage);
        messagesSocket.onPinMessage(handlePinMessage);
        messagesSocket.onUnPinMessage(handleUnpinMessage);
    }, [messagesSocket]);
    
    

    return (
        
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                pinnedMessages,
                pinMessage,
                unPinMessage,
                sendMessage,
                parentMessage,
                updateParentMessage,
                clearParentMessage,
                sending
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

// Create a custom hook to use the chat context
export const useChat = () => {
    return useContext(ChatContext);
};