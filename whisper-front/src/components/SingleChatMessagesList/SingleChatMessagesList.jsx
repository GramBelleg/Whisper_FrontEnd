import ChatMessage from "../ChatMessage/ChatMessage";
import parentRelationshipTypes from "../../services/chatservice/parentRelationshipTypes";
import { useChat } from '@/contexts/ChatContext';
import "./SingleChatMessagesList.css";

const SingleChatMessagesList = () => {
    const { messages, updateParentMessage, pinMessage, unPinMessage } = useChat();
    return (
        <div className="single-chat-messages-list">
            {
                messages?.map((message,index) => (
                    <ChatMessage
                        key={index}
                        onReply={() => { updateParentMessage(message, parentRelationshipTypes.REPLY); }}
                        onPin={pinMessage}
                        onUnpin={unPinMessage}
                        message={message}
                    />
                ))
            }
        </div>
    );
};

export default SingleChatMessagesList;
