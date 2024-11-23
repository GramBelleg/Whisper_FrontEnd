import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import { mapMessage } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { useWhisperDB } from './WhisperDBContext';
import { handleSearchChat } from '@/services/chatservice/searchChat';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);// TODO: handle from back
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket(socket);
    const { db } = useWhisperDB();

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
    }, [currentChat]);

    const sendMessage = async (type, content, attachmentPayload = null) => {
        setSending(true);
        const newMessage = {
            chatId: currentChat.id,
            content:content,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 0,
            type:type,
            sentAt : new Date().toLocaleDateString(),
            media: "",
            extension:"",
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

    
        // messagesSocket.sendData(newMessageForBackend);
        try {
            await db.insertMessage(newMessage);
        } catch (error) {
            console.error(error);
        }
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
    
    const searchChat = async (query) => {
        try {
            const results = await handleSearchChat(query, currentChat.id);
            return results;
        } catch (error) {
            console.log(error);
        }
    }

    const pinMessage = (messsageId, durtaion) => {
        messagesSocket.pinMessage({
            chatId: currentChat.id,
            messageId: messsageId,
            duration: durtaion,
        });
        // TODO: add to indexed DB
    }

    const unPinMessage = (messsageId) => {
        messagesSocket.unPinMessage({
            chatId: currentChat.id,
            messageId: messsageId,
        });
        // TODO: remove from IndexedDB
    }

    useEffect(() => {
        const handleReceiveMessage = (messageData) => {
            setMessages((prevMessages) => {

                if(currentChat.id === messageData.chatId) {
                    // Find the index of the message with matching `sentAt` time
                    const messageIndex = prevMessages.findIndex(
                        (message) => message.sentAt === messageData.sentAt
                    );
        
                    // If a matching message is found
                    if (messageIndex !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[messageIndex] = {...mapMessage(messageData)}
        
                        return updatedMessages; // Return the updated array
                    }
                } else {
                    // TODO: save it to indexedDB
                }
        
                return prevMessages;
            });
        };

        const handlePinMessage = (pinData) => {
            const { messsageId, chatId } = pinData;
            if (messsageId === currentChat.id) {
                const messageIndex = messages.findIndex(
                    (message) => message.id === chatId
                );
                if (messageIndex !== -1) {
                    const updatedMessages = [...messages];
                    updatedMessages[messageIndex].isPinned = true
                    setMessages(updatedMessages);
                    setPinnedMessages([...pinnedMessages, pinData]);
                }
            } else {
                // TODO: save to indexedDB
            }
        }

        const handleUnpinMessage = (pinData) => {
            const { messsageId, chatId } = pinData;
            if (messsageId === currentChat.id) {
                const messageIndex = messages.findIndex(
                    (message) => message.id === chatId
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
    
        messagesSocket.onReceiveMessage(handleReceiveMessage);
        messagesSocket.onPinMessage(handlePinMessage);
        messagesSocket.onPinMessage(handleUnpinMessage);
    
        return () => {
            messagesSocket.offReceiveMessage(handleReceiveMessage);
            messagesSocket.offPinMessage(handleReceiveMessage);
            messagesSocket.offPinMessage(handleUnpinMessage);
        };
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
                searchChat,
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