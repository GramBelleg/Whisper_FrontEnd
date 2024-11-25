import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import { mapMessage } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { useWhisperDB } from './WhisperDBContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket(socket);
    const { db } = useWhisperDB();
    const currentChatRef = useRef(currentChat);
    const [messageReceived, setMessageReceived] = useState(false);

    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    const loadMessages = async (id) => {
        try {
            const myMessages = await db.getMessagesForChat(id);
            setMessages(myMessages);
        } catch (error) {
            console.log(error);
        }
    }

    const loadPinnedMessages = async (id) => {
        try {
            const myPinnedMessages = await db.getPinnedMessagesForChat(id);
            setPinnedMessages(myPinnedMessages);
        } catch (error) {
            console.log(error);
        }
    }

    const clearUnreadMessages = async (id) => {
        try {
            await db.updateUnReadMessagesCount(id, 0);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (currentChat) {
            // TODO: handle with back
            loadMessages(currentChat.id);
            clearUnreadMessages(currentChat.id);
            loadPinnedMessages(currentChat.id);
        } else {
            setMessages([]);
            setPinnedMessages([]);
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
            // extension:"",
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
    const pinMessage = (messsageId, durtaion = 0) => {
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
            const activeChat = currentChatRef.current; 
            const myMessageData = {
                ...messageData,
            }

            try {
                await db.insertMessage({ ...mapMessage(myMessageData), drafted: false});
                setMessageReceived(true);
            } catch (error) {
                throw error;
            }
            
            if (activeChat && activeChat.id === myMessageData.chatId) {
                loadMessages(activeChat.id); 
            } 
            else {
                try {
                    await db.updateUnReadMessagesCount(myMessageData.chatId, 1);
                } catch (error) {
                    throw error;
                }
            }
            setMessageReceived(false);
                
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

            try {
                await db.pinMessage({...pinData, content: messageToPin.content});
            } catch(error) {
                throw error;
            }
            
            try {
                await db.updateMessagesForPinned(pinData.pinnedMessage);
            } catch(error) {
                throw error;
            }
            loadMessages(activeChat.id);
            loadPinnedMessages(activeChat.id);
        } catch (error) {
            console.error(error);
        }
    }

    const handleUnpinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current; 
            const messagesForChat = await db.getMessagesForChat(pinData.chatId);
            const messageToPin = messagesForChat.find(
                (message) => message.id === pinData.unpinnedMessage
            );

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.unpinnedMessage} not found in chat ${pinData.chatId}`);
            } 
            try {
                await db.unPinMessage(messageToPin.id);
            } catch(error) {
                throw error;
            }

            try {
                await db.updateMessagesForUnPinned(messageToPin.id);
            } catch(error) {
                throw error;
            }   

            loadMessages(activeChat.id);
            loadPinnedMessages(activeChat.id);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(messagesSocket) {
            messagesSocket.onReceiveMessage(handleReceiveMessage);
            messagesSocket.onPinMessage(handlePinMessage);
            messagesSocket.onUnPinMessage(handleUnpinMessage);
        }
    }, [messagesSocket]);

    useEffect(() => {
    }, [messages, pinnedMessages]);

    return (
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                messageReceived,
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