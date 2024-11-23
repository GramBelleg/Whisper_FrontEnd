import ChatMessage from "../ChatMessage/ChatMessage";
import parentRelationshipTypes from "../../services/chatservice/parentRelationshipTypes";
import { useChat } from '@/contexts/ChatContext';
import "./SingleChatMessagesList.css";
import { useEffect, useState } from "react";


const SingleChatMessagesList = () => {
    const { messages, updateParentMessage } = useChat();

    const [myMessages, setMyMessages] = useState([]);

    useEffect(() => {
        setMyMessages(messages);
    }, [messages]);

    return (
        <div className="single-chat-messages-list">
            {
                myMessages?.map((message,index) => (
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