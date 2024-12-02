import ChatMessage from "../ChatMessage/ChatMessage";
import parentRelationshipTypes from "../../services/chatservice/parentRelationshipTypes";
import { useChat } from '@/contexts/ChatContext';
import "./SingleChatMessagesList.css";
import { useEffect } from "react";


const SingleChatMessagesList = () => {
    const { messages, updateParentMessage } = useChat();

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    return (
        <div className="single-chat-messages-list">
            {
                messages?.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))
            }
        </div>
    );
};

export default SingleChatMessagesList;