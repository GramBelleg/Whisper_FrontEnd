import ChatMessage from "../ChatMessage/ChatMessage";
import parentRelationshipTypes from "../../services/chatservice/parentRelationshipTypes";
import { useChat } from '@/contexts/ChatContext';
import "./SingleChatMessagesList.css";
import { useEffect } from "react";


const SingleChatMessagesList = () => {
    const { messages, updateParentMessage } = useChat();

    useEffect(() => {
    }, [messages]);

    return (
        <div className="single-chat-messages-list">
            {
                messages?.map((message,index) => (
                    <ChatMessage
                        key={index}
                        onReply={() => { updateParentMessage(message, parentRelationshipTypes.REPLY); }}
                        message={message}
                    />
                ))
            }
        </div>
    );
};

export default SingleChatMessagesList;