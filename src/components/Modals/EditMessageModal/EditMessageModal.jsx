import { useModal } from '@/contexts/ModalContext'
import { useChat } from '@/contexts/ChatContext'
import './EditMessageModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ChatTextingActions from '@/components/ChatTextingActions/ChatTextingActions'
import ChatMessage from '@/components/ChatMessage/ChatMessage'

const EditMessageModal = ({ message }) => {
    const { updateMessage } = useChat()
    const { closeModal } = useModal()
    const [textMessage, setTextMessage] = useState(message.content)

    const handleEdit = () => {
        updateMessage(message.id, textMessage)
        closeModal()
    }

    return (
        <div className='edit-message-modal'>
            <div className='header'>
                <span className='close-icon' data-testid='close-icon'>
                    <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
                </span>
                <h3>Edit Message</h3>
            </div>

            <div className='edit-message-content'>
                <div className='w-3/4'>
                    <ChatMessage message={message} hideActions={true} />
                </div>
            </div>

            <div className='edit-message-actions'>
                <ChatTextingActions
                    data-testid='chat-texting-actions'
                    textMessage={textMessage}
                    setTextMessage={setTextMessage}
                    triggerSendMessage={handleEdit}
                />
                <div className='flex justify-center items-center rounded-full edit-button' data-testid='send-button' onClick={handleEdit}>
                    <FontAwesomeIcon icon={faCheck} />
                </div>
            </div>
        </div>
    )
}

export default EditMessageModal
