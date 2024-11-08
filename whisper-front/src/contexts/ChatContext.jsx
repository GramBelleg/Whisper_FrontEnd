import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import MessagingSocket from '@/services/sockets/MessagingSocket';
import { whoAmI } from '@/services/chatservice/whoAmI';
import useFetch from '@/services/useFetch';
import { getMessagesForChatCleaned } from '@/services/chatservice/getMessagesForChat';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);// TODO: handle from back
    const [parentMessage, setParentMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const messagingSocket = new MessagingSocket();
        
    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    const loadMessages = async (id) => {
        const myMessages = await getMessagesForChatCleaned(id);
        setMessages(myMessages);
    }

    useEffect(() => {
        if (currentChat) {
            // TODO: handle with back
            loadMessages(currentChat.id);
        }
    }, [currentChat]);

    const sendMessage = (type, content, attachmentPayload = null) => {
        setSending(true);
        const newMessage = {
            chatId: currentChat.id,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            pinned: false,
            content:content,
            type:type,
        }

        if (attachmentPayload !== null) {
            newMessage.file = attachmentPayload.file;
            newMessage.fileType = attachmentPayload.type;
            newMessage.blobName = attachmentPayload.blobName;
        }


        const newMessageForBackend = { ...newMessage };
       
        newMessage.senderId = whoAmI.id,
        newMessage.deliveredAt = '';
        newMessage.time = new Date(),
        newMessage.readAt = '';
        newMessage.deleted = false;
        newMessage.sender = whoAmI.name;
        newMessage.state = 4;
        newMessage.media = false;
    
        socket.emit('send', newMessageForBackend)
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

    const pinMessage = (message, duration) => {
        messagingSocket.pinMessage(message.id, currentChat.id,duration);
        const messageTime = message.time;
        setMessages((prevMessages) => {
            return prevMessages.map((msg) =>
                msg.time === messageTime
                    ? { ...msg, pinned: true } 
                    : msg
            );
        });
        setcurrentChat((prevChat) => ({
            ...prevChat,
            pinnedMessages: [message, ...(prevChat.pinnedMessages || [])]
        }));
        //emit socket event
    };
    const unPinMessage = (message) => {
        messagingSocket.unpinMessage(message.id, currentChat.id);
        const messageTime = message.time;
        setMessages((prevMessages) => {
            return prevMessages.map((message) =>
                message.time === messageTime
                    ? { ...message, pinned: false } 
                    : message
            );
        }
        );
        setcurrentChat((prevChat) => ({
            ...prevChat,
            pinnedMessages: (prevChat.pinnedMessages || []).filter(
                (pinnedMsg) => pinnedMsg.time !== messageTime
            )
        }));
        //emit socket event
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
        const handlePinMessage = (data) => {
            const { pinnedMessage } = data;
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === pinnedMessage.id ? { ...msg, pinned: true } : msg
                )
            );
        };

        const handleUnpinMessage = (data) => {
            const { unpinnedMessage } = data;
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === unpinnedMessage.id ? { ...msg, pinned: false } : msg
                )
            );
        };
        
        socket.on("receive", handleReceiveMessage);
        messagingSocket.listenForPinEvents(handlePinMessage, handleUnpinMessage);

        return () => 
            {
                socket.off("receive", handleReceiveMessage);
                messagingSocket.removePinEventListeners();
            };
    }, []);

    return (
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                sendMessage,
                parentMessage,
                updateParentMessage,
                clearParentMessage,
                pinMessage,
                unPinMessage,
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
