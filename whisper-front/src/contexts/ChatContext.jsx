import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import { getMessagesForChatCleaned, getPinnedMessagesForChat } from '@/services/chatservice/getMessagesForChat';
import MessagingSocket from '@/services/sockets/MessagingSocket';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);// TODO: handle from back
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesSocket = new MessagingSocket(socket);

    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    const loadMessages = async (id) => {
        try {
            const myMessages = await getMessagesForChatCleaned(id);
            setMessages(myMessages);
        } catch (error) {
            setMessages([]);
            console.log(error);
        }
    }

    const loadPinnedMessages = async (id) => {
        try {
            const myPinnedMessages = await getPinnedMessagesForChat(id);
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

    const sendMessage = (type, content, attachmentPayload = null) => {
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
    
        messagesSocket.sendData(newMessageForBackend)
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
            setMessages(prevMessages => {
                const messageIndex = prevMessages.findIndex(
                    (message) => messageData.content === message.content
                );
                
                if (messageIndex !== -1) {
                    const newMessages = [...prevMessages];
                    newMessages[messageIndex] = {
                        ...newMessages[messageIndex],
                        id: messageData.id,
                        state: 'sent'
                    };
                    return newMessages;
                }
                return prevMessages;
            });
        };
        
        socket.on("receive", handleReceiveMessage);
        return () => socket.off("receive", handleReceiveMessage);
    }, []);

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
