import './ChatMessage.css'
import SentTicks from '../SentTicks/SentTicks'
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks'
import ReadTicks from '../ReadTicks/ReadTicks'
import PendingSend from '../PendingSend/PendingSend'
import AudioVoiceMessage from '../AudioVoiceMessage/AudioVoiceMessage'
import { messageTypes } from '@/services/sendTypeEnum'
import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faShare, faTrash, faThumbtack, faThumbtackSlash, faCircleInfo, faEdit } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import ForwardMessageModal from '../Modals/ForwardMessageModal/ForwardMessageModal'
import { useChat } from '@/contexts/ChatContext'
import MessageRelationshipsViewer from './MessageRelationshipsViewer'
import EditMessageModal from '../Modals/EditMessageModal/EditMessageModal'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import MessageAttachmentRenderer from '../MessageAttachment/MessageAttachementRenderer'
import MessageInfo from '../MessageInfo/MessageInfo'
import useAuth from '@/hooks/useAuth'

const ChatMessage = ({ message, hideActions }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false) // Track menu state
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [objectLink, setObjectLink] = useState(null)
    const { openModal, openConfirmationModal } = useModal()
    const menuOverlayGutter = 40
    const { pinMessage, unPinMessage, deleteMessage, updateParentMessage } = useChat()
    const { user } = useAuth();

    const toggleMenu = (e) => {
        if (hideActions) return
        e.preventDefault() // Prevent default behavior (for long-press or right-click)
        setMenuPosition({ x: e.clientX, y: e.clientY }) // Set the position of the menu
        setIsMenuOpen(!isMenuOpen) // Toggle menu visibility
    }

    const handleDelete = () => {
        openConfirmationModal('Are you sure you want to delete this message?', () => {
            deleteMessage(message.id)
        })
        setIsMenuOpen(false)
    }

    const handleReply = () => {
        updateParentMessage(message, parentRelationshipTypes.REPLY)
        setIsMenuOpen(false)
    }

    const handleForward = () => {
        openModal(<ForwardMessageModal message={message} />)
        setIsMenuOpen(false)
    }

    const handleMessageInfo = () => {
        openModal(<MessageInfo message={message} />)
    }

    const handleEdit = () => {
        openModal(<EditMessageModal message={message} />)
        setIsMenuOpen(false)
    }

    const handlePin = () => {
        pinMessage(message.id)
    }

    const handleUnPin = () => {
        unPinMessage(message.id)
    }

    const updateObjectLink = (objectLink) => {
        setObjectLink(objectLink)
    }

    const messageTime = useMemo(() => {
        // Assuming message.time is "2024-11-01 18:24:00"
        const date = new Date(message.time)
        let hours = date.getHours()
        let minutes = date.getMinutes()

        // If minutes are 0, display as "00" instead
        minutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0')

        // Format time as HH:MM
        return `${hours}:${minutes}`
    }, [message.time])

    const renderMessageContent = useMemo(() => {
        switch (message.type) {
            case messageTypes.TEXT:
                return (
                    <div className='message-text' style={{ whiteSpace: 'pre-line' }}>
                        {message.media && <MessageAttachmentRenderer myMessage={message} />}
                        {message.content}
                    </div>
                )
            case messageTypes.AUDIO:
                return <AudioVoiceMessage blobName={message.media} />
            case messageTypes.IMAGE:
                return <img src={message.content} alt='message' className='message-image' />
            default:
                return null
        }
    }, [message])

    return (
        <div
            className={`message shadow ${message.senderId === user.userId ? 'sender' : 'reciever'}`}
            onContextMenu={toggleMenu} // Right-click or long-press to open menu
        >
            <MessageRelationshipsViewer message={message} />

            <div className='flex flex-col justify-between'>
                {renderMessageContent}

                <div className='message-info'>
                    {message.edited ? <span className='text-sm opacity-60'>edited</span> : null}
                    <span className='time opacity-60'>{messageTime}</span>
                    {message.senderId === user.userId && (
                        <span className='message-status'>
                            {message.state === 0 && <SentTicks width='12px' />}
                            {message.state === 1 && <DeliveredTicks width='12px' />}
                            {message.state === 2 && <ReadTicks width='12px' />}
                            {message.state === 4 && <PendingSend width='12px' />}
                        </span>
                    )}
                </div>
            </div>

            {isMenuOpen && (
                <div
                    className='message-actions-overlay'
                    onMouseLeave={() => setIsMenuOpen(false)}
                    style={{
                        top: menuPosition.y - menuOverlayGutter,
                        left: menuPosition.x - menuOverlayGutter,
                        padding: `${menuOverlayGutter}px`
                    }}
                >
                    <div className='message-actions-menu shadow-lg'>
                        <button onClick={handleReply}>
                            <FontAwesomeIcon style={{ height: '18px' }} icon={faReply} />
                            <span>Reply</span>
                        </button>
                        {message.content.length ? (
                            <button onClick={handleEdit}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faEdit} />
                                <span>Edit</span>
                            </button>
                        ) : null}
                        <button onClick={handleForward}>
                            <FontAwesomeIcon style={{ height: '18px' }} icon={faShare} />
                            <span>Forward</span>
                        </button>
                        {message.senderId === user.userId && (
                            <button onClick={handleMessageInfo}>
                                <FontAwesomeIcon height={18} icon={faCircleInfo} />
                                <span>Info</span>
                            </button>
                        )}
                        {!message.pinned ? (
                            <button onClick={handlePin}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faThumbtack} />
                                <span>Pin</span>
                            </button>
                        ) : (
                            <button onClick={handleUnPin}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faThumbtackSlash} />
                                <span>UnPin</span>
                            </button>
                        )}
                        <button className='danger' onClick={handleDelete}>
                            <FontAwesomeIcon style={{ height: '18px' }} icon={faTrash} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatMessage
