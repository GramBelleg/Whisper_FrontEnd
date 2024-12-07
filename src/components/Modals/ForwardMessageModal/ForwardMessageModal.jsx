import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import { useChat } from '@/contexts/ChatContext'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import ChatSelector from '@/components/ChatSelector/ChatSelector'
import './ForwardMessageModal.css'
import { useEffect, useState } from 'react'

const ForwardMessageModal = ({ message }) => {
    const { selectChat, sendMessage,  currentChat } = useChat()
    const [sendMessageFlag, setSendMessageFlag] = useState(false)
    const [selectedChat, setSelectedChat] = useState(false)
    const { closeModal } = useModal()

    const handleForward = (chat) => {
        selectChat(chat)
        setSelectedChat(chat)
        setSendMessageFlag(true)
    }

    useEffect(() => {
        if (sendMessageFlag && selectedChat) {
            sendMessage({
                chatId: selectedChat.id,
                content: message.content,
                type: message.type,
                media: message.media,
                extension: message.extension,
                sentAt: new Date().toISOString(),
                forwarded: true,
                forwardedFromUserId: message.senderId
            })
            closeModal()
            setSendMessageFlag(false)
        }
    }, [sendMessageFlag, currentChat, selectedChat])

    return (
        <div className='forward-message-modal'>
            <ChatSelector onChatSelect={handleForward} searchPlaceholder='Forward to...' className='forward-modal-selector' />
        </div>
    )
}

export default ForwardMessageModal
