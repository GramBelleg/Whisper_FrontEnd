import './ChatMessage.css'
import SentTicks from '../SentTicks/SentTicks'
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks'
import ReadTicks from '../ReadTicks/ReadTicks'
import { mapMessageState } from '../../services/chatservice/mapMessageState'
import PendingSend from '../PendingSend/PendingSend'
import { whoAmI } from '../../services/chatservice/whoAmI'
import AudioVoiceMessage from '../AudioVoiceMessage/AudioVoiceMessage'
import { messageTypes } from '@/services/sendTypeEnum'
import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faShare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import ForwardMessageModal from '../Modals/ForwardMessageModal/ForwardMessageModal'

const ChatMessage = ({ message, onDelete, onReply }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false) // Track menu state
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const { openModal } = useModal()
    const menuOverlayGutter = 40

    const toggleMenu = (e) => {
        e.preventDefault() // Prevent default behavior (for long-press or right-click)
        setMenuPosition({ x: e.clientX, y: e.clientY }) // Set the position of the menu
        setIsMenuOpen(!isMenuOpen) // Toggle menu visibility
    }

    const handleDelete = () => {
        onDelete(message)
        setIsMenuOpen(false)
    }

    const handleReply = () => {
        onReply(message)
        setIsMenuOpen(false)
    }

    const handleForward = () => {
        openModal(<ForwardMessageModal message={message} />)
        setIsMenuOpen(false)
    }

    const mappedMessageState = useMemo(() => mapMessageState(message.state), [message.state])

    const renderMessageContent = useMemo(() => {
        switch (message.type) {
            case messageTypes.TEXT:
                return (
                    <div className='message-text' style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                    </div>
                )
            case messageTypes.AUDIO:
                return <AudioVoiceMessage audioUrl={message.content} />
            case messageTypes.IMAGE:
                return <img src={message.content} alt='message' className='message-image' />
            default:
                return null
        }
    }, [message.type, message.content])

    return (
        <div
            className={`message shadow ${message.senderId === whoAmI.id ? 'sender' : 'reciever'}`}
            onContextMenu={toggleMenu} // Right-click or long-press to open menu
        >
            {renderMessageContent}

            <div className='message-info'>
                <span className='time'>{message.time}</span>
                {message.senderId === whoAmI.id && (
                    <span className='message-status'>
                        {mappedMessageState === 0 && <SentTicks width='12px' />}
                        {mappedMessageState === 1 && <DeliveredTicks width='12px' />}
                        {mappedMessageState === 2 && <ReadTicks width='12px' />}
                        {mappedMessageState === 4 && <PendingSend width='12px' />}
                    </span>
                )}
            </div>

            {isMenuOpen && (
                <div
                    className='message-actions-overlay' onMouseLeave={() => setIsMenuOpen(false)}
                    style={{ top: menuPosition.y - menuOverlayGutter, left: menuPosition.x - menuOverlayGutter, padding: `${menuOverlayGutter}px` }}
                >
                    <div className='message-actions-menu shadow-lg'>
                        <button onClick={handleReply}>
                            <FontAwesomeIcon height={18} icon={faReply} />
                            <span>Reply</span>
                        </button>
                        <button onClick={handleForward}>
                            <FontAwesomeIcon height={18} icon={faShare} />
                            <span>Forward</span>
                        </button>
                        <button className='danger' onClick={handleDelete}>
                            <FontAwesomeIcon height={18} icon={faTrash} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatMessage
