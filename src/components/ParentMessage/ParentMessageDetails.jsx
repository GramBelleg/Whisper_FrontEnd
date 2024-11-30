import parentRelationshipTypes from "@/services/chatservice/parentRelationshipTypes";
import { messageTypes } from "@/services/sendTypeEnum";
import { useMemo } from "react";



const ParentMessageDetails = ({ message }) => {

    const renderMessageContent = useMemo(() => {
        if(message.type == messageTypes.TEXT) {
            return message.content;
        } else if(message.type == messageTypes.IMAGE) {
            return 'Image';
        } else if(message.type == messageTypes.VIDEO) {
            return 'Video';
        } else if(message.type == messageTypes.AUDIO) {
            return 'Audio';
        } else if(message.type == messageTypes.VOICE) {
            return 'Voice Note';
        }
    
    },[message])
    return (
        <span className='details'>
            {message.relationship == parentRelationshipTypes.FORWARD ? `${message.sender.name}: ${renderMessageContent}` : renderMessageContent }
        </span>
    );
}

export default ParentMessageDetails;