import './ParentMessage.css';
import { faReply, faShare, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parentRelationshipTypes from "../../services/chatservice/parentRelationshipTypes";
import ParentMessageDetails from './ParentMessageDetails';
import { useChat } from '@/contexts/ChatContext';

const ParentMessage = () => {
    const { parentMessage, clearParentMessage } = useChat();

    if (!parentMessage) return null;

    return (
        <div className='actions-row'>
            <div className='parent-message-icon'>
                <FontAwesomeIcon icon={parentMessage.relationship === parentRelationshipTypes.REPLY ? faReply : faShare} />
            </div>
            <div className='parent-message'>
                <span className='header'>
                    {parentMessage.relationship === parentRelationshipTypes.REPLY ? `Reply to ${parentMessage.sender}` : 'Forwarded Message'}
                </span>
                <ParentMessageDetails message={parentMessage} />
            </div>
            <div className='clear-parent-message' onClick={clearParentMessage}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>
    );
};

export default ParentMessage;
