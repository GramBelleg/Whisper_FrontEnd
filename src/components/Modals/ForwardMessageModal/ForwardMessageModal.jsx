import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import { useChat } from '@/contexts/ChatContext'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import ChatSelector from '@/components/ChatSelector/ChatSelector'
import './ForwardMessageModal.css'

const ForwardMessageModal = ({ message }) => {
    const { selectChat, sendMessage } = useChat()
    const { closeModal } = useModal()

    const handleForward = (chat) => {
        selectChat(chat)
        console.log('Forwarding message to chat:', chat)

        sendMessage({
            chatId: chat.id,
            content: message.content,
            type: message.type,
            media: message.media,
            extension: message.extension,
            sentAt: new Date().toISOString(),
            forwarded: true,
            forwardedFromUserId: message.senderId
        })
        closeModal()
    }

    return (
        <div className='forward-message-modal'>
            <ChatSelector onChatSelect={handleForward} searchPlaceholder='Forward to...' className='forward-modal-selector' />
        </div>
    )
}

export default ForwardMessageModal
