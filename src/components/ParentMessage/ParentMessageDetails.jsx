import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import { messageTypes } from '@/services/sendTypeEnum'
import { useMemo } from 'react'

const ParentMessageDetails = ({ message }) => {
    const renderMessageContent = useMemo(() => {
        if (message.type == messageTypes.TEXT.toUpperCase()) {
            return message.content
        } else if (message.type == messageTypes.IMAGE.toUpperCase()) {
            return 'Image'
        } else if (message.type == messageTypes.VIDEO.toUpperCase()) {
            return 'Video'
        } else if (message.type == messageTypes.AUDIO.toUpperCase()) {
            return 'Audio'
        } else if (message.type == messageTypes.VOICE.toUpperCase()) {
            return 'Voice Note'
        }
    }, [message])
    return (
        <span className='details'>
            {message.relationship == parentRelationshipTypes.FORWARD ? `${message.sender}: ${renderMessageContent}` : renderMessageContent}
        </span>
    )
}

export default ParentMessageDetails
