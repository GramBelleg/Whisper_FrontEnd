import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import { mapMessage } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { useWhisperDB } from './WhisperDBContext';
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes';
import { messageTypes } from '@/services/sendTypeEnum';
import { data } from 'autoprefixer';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket(socket);
    const { dbRef } = useWhisperDB();
    const currentChatRef = useRef(currentChat);

    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    const loadMessages = async (id) => {
        try {
            const myMessages = await dbRef.current.getMessagesForChat(id);
            setMessages(myMessages);
        } catch (error) {
            console.log(error);
        }
    }

    const loadPinnedMessages = async (id) => {
        try {
            const myPinnedMessages = await dbRef.current.getPinnedMessagesForChat(id);
            setPinnedMessages(myPinnedMessages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentChat) {
            // TODO: handle with back
            loadMessages(currentChat.id);
            loadPinnedMessages(currentChat.id);
        } else {
            setMessages([]);
            setPinnedMessages([]);
        }
        currentChatRef.current = currentChat;
    }, [currentChat]);


    const updateMessage = async (messageId, content) => {
        
        messagesSocket.updateData({ 
            chatId: currentChat.id,
            messageId: messageId,
            content: content
         });
    }


    const deleteMessage = async (messageId) => {
        messagesSocket.deleteMessage({ 
            chatId: currentChat.id,
            messages: [messageId],
         });
    }

    const sendMessage = async (data) => {
        setSending(true);
        const newMessage = {
            chatId: currentChat.id,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            sentAt : new Date().toISOString(),
            media: "",
            extension:"",
            parentMessageId: null,
            forwardedFromUserId: null,
            mentions:[],
            isSecret: false,
            isAnnouncement: false,
            ...data          
        }

        if(parentMessage && parentMessage.relationship === parentRelationshipTypes.REPLY) {
            newMessage.parentMessageId = parentMessage.id;
        }


        const newMessageForBackend = { ...newMessage };

        console.log("newMessageForBackend",newMessageForBackend);
       
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
        setParentMessage(null);
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
            await dbRef.current.insertMessage({ ...mapMessage(messageData), read: false, delivered: false });
            await loadMessages(activeChat.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReceiveEditMessage = async (messageData) => {
        try {

            await dbRef.current.updateMessage(messageData.messageId, { 
                content: messageData.content,
                 edited: true 
            });

            setMessages((prevMessages) => {
                return prevMessages.map((message) => {
                    if (message.id === messageData.messageId) {
                        return {
                            ...message, 
                            content: messageData.content, 
                            edited: true
                        };
                    }
                    return message;
                });
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleReceiveDeleteMessage = async (deletedData) => {
        try {
            // we only delete one message at a time no bulk deletes
            await dbRef.current.deleteMessage(deletedData.messages[0]);

            setMessages((prevMessages) => {
                return prevMessages.filter((message) => message.id != deletedData.messages[0]);
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handlePinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current; 
            const messagesForChat = await dbRef.current.getMessagesForChat(pinData.chatId);
            const messageToPin = messagesForChat.find(
                (message) => message.id === pinData.pinnedMessage
            );

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.pinnedMessage} not found in chat ${pinData.chatId}`);
            }   

            await dbRef.current.pinMessage({...pinData, content: messageToPin.content});
            await dbRef.current.updateMessagesForPinned(pinData.pinnedMessage);

            loadMessages(activeChat.id);
            loadPinnedMessages(activeChat.id);
        } catch (error) {
            console.error(error);
        }
    }

    const handleUnpinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current; 
            const messagesForChat = await dbRef.current.getMessagesForChat(pinData.chatId);
            const messageToPin = messagesForChat.find(
                (message) => message.id === pinData.unpinnedMessage
            );

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.unpinnedMessage} not found in chat ${pinData.chatId}`);
            } 
            try {
                await dbRef.current.unPinMessage(messageToPin.id);
            } catch(error) {
                throw error;
            }

            try {
                await dbRef.current.updateMessagesForUnPinned(messageToPin.id);
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
            messagesSocket.onReceiveEditMessage(handleReceiveEditMessage);
            messagesSocket.onReceiveDeleteMessage(handleReceiveDeleteMessage);
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
                pinnedMessages,
                pinMessage,
                unPinMessage,
                sendMessage,
                updateMessage,
                parentMessage,
                updateParentMessage,
                clearParentMessage,
                deleteMessage,
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