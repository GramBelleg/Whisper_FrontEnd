import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/services/messagingservice/sockets/sockets'
import { whoAmI } from '@/services/chatservice/whoAmI';
import useFetch from '@/services/useFetch';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null);
    const [messagesURL, setMessagesURL] = useState(null);
    const {data: messages, setData: setMessages} = useFetch(messagesURL);
    const [parentMessage, setParentMessage] = useState(null);


    const selectChat = (chat) => {
        setcurrentChat(chat);
        setParentMessage(null);
    };

    useEffect(() => {
        if (currentChat) {
            setMessagesURL(`/chats/getMessages/${currentChat.id}`);
        }
    }, [currentChat]);

    const sendMessage = (type, content) => {
        const newMessage = {
            id: 4,
            chatId: currentChat,
            senderId: whoAmI.id,
            sender: {
                id: whoAmI.id,
                name: whoAmI.name,
            },
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            time: new Date().toLocaleTimeString(),
            state: 'pending',
            type: type,
            content: content,
            // TODO : recheck this field
            othersId: null
        }

        socket.emit('send', newMessage)
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
    };

    const updateParentMessage = (message, relationship) => {
        setParentMessage({ relationship, ...message });
    };

    const clearParentMessage = () => {
        setParentMessage(null);
    };

    // const { data: messages, loading: messagesLoading, error: messagesError } = useFetch('/userMessages')
    // const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend)
    // const { data: userDetailsFromBack, loading, error } = useFetch('/userDetails')


    return (
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                sendMessage,
                parentMessage,
                updateParentMessage,
                clearParentMessage
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
