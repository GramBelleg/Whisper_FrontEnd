import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { whoAmI } from '@/services/chatservice/whoAmI';
import { mapMessage } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { useWhisperDB } from './WhisperDBContext';
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes';
import { messageTypes } from '@/services/sendTypeEnum';
import { data } from 'autoprefixer';
import { handleSearchChat } from '@/services/chatservice/searchChat';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket();
    const { dbRef } = useWhisperDB();
    const currentChatRef = useRef(currentChat);
    const [messageReceived, setMessageReceived] = useState(false);

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

    const clearUnreadMessages = async (id) => {
        try {
            await dbRef.current.updateUnReadMessagesCount(id, 0);
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
            // file: null,
            // objectLink: "",
            // fileType: attachmentType,
            size: null,
            // autoDownload: null,
            // fileName: null, 
            ...data          
        }

        if(parentMessage && parentMessage.relationship === parentRelationshipTypes.REPLY) {
            newMessage.parentMessageId = parentMessage.id;      
        }
        /*if (true) { // TODO: handle upload
            let blob = await uploadFile(tempMessageObject,uploadData);
            if (blob) {
                tempMessageObject.media = blob.blobName;
            }
        }

        if (errorUpload) {
            console.log(errorUpload)
        }*/
        const newMessageForBackend = { ...newMessage };

        console.log("newMessageForBackend",newMessageForBackend);
       
        newMessage.senderId = whoAmI.userId,
        newMessage.deliveredAt = '';
        newMessage.readAt = '';
        newMessage.deleted = false;
        newMessage.sender = whoAmI.name;
        newMessage.state = 4;
        newMessage.time = new Date();
        newMessage.file = (attachmentPayload && attachmentPayload.file) ? attachmentPayload.file: null;
        newMessage.autoDownload = null;
        newMessage.fileType = null;
    
        messagesSocket.sendData(newMessageForBackend);
        setSending(false);
        setMessages((prevMessages) => {
            if (prevMessages) {
                return [{id: Date.now(), ...newMessage}, ...prevMessages];
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
    
    const searchChat = async (query) => {
        try {
            if (currentChat) {
                const response = await dbRef.current.getMessagesForChat(currentChat.id)
                const filteredMessages = response.filter((message) =>
                    message.content.toLowerCase().includes(query.toLowerCase())
                );
                return filteredMessages;
            }
            else {
                throw new Error('No chat selected');
            }
        } catch (error) {
            console.error(error);
        }
    } 
    
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

            await dbRef.current.insertMessage({ ...mapMessage(myMessageData), drafted: false});
            setMessageReceived(true);
            
            if (activeChat && activeChat.id === myMessageData.chatId) {
                loadMessages(activeChat.id); 
            } 
            else {
                await dbRef.current.updateUnReadMessagesCount(myMessageData.chatId, 1);
            }
            setMessageReceived(false);

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
                messageReceived,
                pinnedMessages,
                pinMessage,
                unPinMessage,
                sendMessage,
                updateMessage,
                searchChat,
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