import './ChatMessage.css'
import SentTicks from '../SentTicks/SentTicks'
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks'
import ReadTicks from '../ReadTicks/ReadTicks'
import PendingSend from '../PendingSend/PendingSend'
import AudioVoiceMessage from '../AudioVoiceMessage/AudioVoiceMessage'
import { messageTypes } from '@/services/sendTypeEnum'
import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faShare, faTrash, faThumbtack, faThumbtackSlash, faCircleInfo, faEdit, faCircleArrowDown, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import ForwardMessageModal from '../Modals/ForwardMessageModal/ForwardMessageModal'
import { useChat } from '@/contexts/ChatContext'
import MessageRelationshipsViewer from './MessageRelationshipsViewer'
import EditMessageModal from '../Modals/EditMessageModal/EditMessageModal'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import MessageAttachmentRenderer from '../MessageAttachment/MessageAttachementRenderer'
import MessageInfo from '../MessageInfo/MessageInfo'
import useAuth from '@/hooks/useAuth'
import CallLog from '../CallLog/CallLog'
import { getMemberPermissions, getSubscriberPermissions } from '@/services/chatservice/getChatMemberPermissions'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
const ChatMessage = ({ id, message, hideActions }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false) // Track menu state
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [objectLink, setObjectLink] = useState(null)
    const { openModal, openConfirmationModal, closeModal } = useModal()
    const menuOverlayGutter = 40
    const { currentChat, pinMessage, unPinMessage, 
            deleteMessage, deleteComment, updateParentMessage, 
            setIsThreadOpenned, isThreadOpenned, 
            threadMessage, setThreadMessage } = useChat()
    const { user } = useAuth()
    const colors = ['purple', 'aqua', 'lightgreen'];
    const [randomColor, setRandomColor] = useState('');
    const toggleMenu = (e) => {
        if (hideActions) return
        e.preventDefault() 
        if (threadMessage) {
            setMenuPosition({x: "10px", y: "10px"})
        }
        else {
            setMenuPosition({ x: e.clientX, y: e.clientY }) 
        }
        setIsMenuOpen(!isMenuOpen) 
    }

    const handleDelete = () => {
        openConfirmationModal('Are you sure you want to delete this message?', () => {
            if (threadMessage) {
                deleteComment(message.id)
            } else {
                deleteMessage(message.id)
            }
        })
        setIsMenuOpen(false)
    }

    const handleReply = () => {
        updateParentMessage(message, parentRelationshipTypes.REPLY)
        setIsMenuOpen(false)
    }

    const handleThread = () => {
        setIsMenuOpen(false)
        setIsThreadOpenned(true)
        setThreadMessage({...message})
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
    const handleDownload = async () => {
        if (currentChat.type === "CHANNEL" || currentChat.type === "GROUP" && message.senderId !== user.userId) {
            let permissions;
            if (currentChat.type === "GROUP") {
                permissions = await getMemberPermissions(currentChat.id, user.userId)
            }
            if (currentChat.type === "CHANNEL") {
                permissions = await getSubscriberPermissions(currentChat.id, user.userId)
            }
            if(!permissions.canDownload) {
                openModal(<ErrorMessage errorMessage="You do not have permission to download files in this chat." onClose={closeModal} appearFor={3000}/>)
                return
            }
        }
        const blobUrl = URL.createObjectURL(message.blobData);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = message.attachmentName || "download"; 
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
        setIsMenuOpen(false)
    }

    const handlePin = () => {
        setIsMenuOpen(false)
        pinMessage(message.id)
    }

    const handleUnPin = () => {
        setIsMenuOpen(false)
        unPinMessage(message.id)
    }

    const updateObjectLink = (objectLink) => {
        setObjectLink(objectLink)
    }

    useEffect(() => {
        setRandomColor(colors[Math.floor(Math.random() * colors.length)])
    }, [])


    const messageTime = useMemo(() => {
        const date = new Date(message.time)
        let hours = date.getHours()
        let minutes = date.getMinutes()

        minutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0')

        return `${hours}:${minutes}`
    }, [message.time])

    const renderMessageContent = useMemo(() => {
        switch (message.type.toUpperCase()) {
            case messageTypes.TEXT:
                return (
                    <div className='message-text' style={{ whiteSpace: 'pre-line' }}>
                        {message?.media && <MessageAttachmentRenderer myMessage={message} />}
                        {message.content}
                    </div>
                )
            case messageTypes.AUDIO:
                return <AudioVoiceMessage blobName={message.media} />
            case messageTypes.CALL:
                return <CallLog message={message} />
            case messageTypes.IMAGE:
                return <img src={message.content} alt='message' className='message-image' />
            default:
                return null
        }
    }, [message])

    if (message.type === messageTypes.EVENT) {
        return null;
    }

    return (
        <div className={`message-container ${isThreadOpenned ? 'thread': ''}`}>
            <div
                id={id}
                className={`message shadow ${message.senderId === user.userId 
                    ? (isThreadOpenned ? 'sender thread' : 'sender') 
                    : 'reciever'}`}
                onContextMenu={toggleMenu} 
            >
                <MessageRelationshipsViewer message={message} />

                <div className='flex flex-col justify-between'>
                    {currentChat.type !== "DM" && message.sender !== user.userName && (
                        <div style={{color: randomColor}}>
                            {message.sender}
                        </div>
                    )}
                    
                    {renderMessageContent}
                    
                    <div className='message-info'>
                        {message?.edited ? <span className='text-sm opacity-60'>edited</span> : null}
                        <span className='time opacity-60'>{messageTime}</span>
                        {message.senderId === user.userId && currentChat.type !== "CHANNEL" && (
                            <span className='message-status'>
                                {message?.state === 0 && <SentTicks width='12px' />}
                                {message?.state === 1 && <DeliveredTicks width='12px' />}
                                {message?.state === 2 && <ReadTicks width='12px' />}
                                {message?.state === 4 && <PendingSend width='12px' />}
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
                            {(!isThreadOpenned) && <button onClick={handleReply}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faReply} />
                                <span>Reply</span>
                            </button>}
                            {(!isThreadOpenned) && (currentChat && currentChat.type === "CHANNEL") && <button onClick={handleThread}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faCommentDots} />
                                <span>Open thread</span>
                            </button>}
                            { (!isThreadOpenned) && message.content.length && message.senderId === user.id &&  (
                                <button onClick={handleEdit}>
                                    <FontAwesomeIcon style={{ height: '18px' }} icon={faEdit} />
                                    <span>Edit</span>
                                </button>
                            )}
                            { (!isThreadOpenned) && message.blobData && message.attachmentType !== "0" && (
                                <button onClick={handleDownload}>
                                    <FontAwesomeIcon style={{ height: '18px' }} icon={faCircleArrowDown} />
                                    <span>Download</span>
                                </button>
                            )}
                            {(!isThreadOpenned) && <button onClick={handleForward}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faShare} />
                                <span>Forward</span>
                            </button>}
                            {(!isThreadOpenned) && message.senderId === user.userId && (
                                <button onClick={handleMessageInfo}>
                                    <FontAwesomeIcon height={18} icon={faCircleInfo} />
                                    <span>Info</span>
                                </button>
                            )}
                            {!message.pinned && (!isThreadOpenned) ? (
                                <button onClick={handlePin}>
                                    <FontAwesomeIcon style={{ height: '18px' }} icon={faThumbtack} />
                                    <span>Pin</span>
                                </button>
                            ) : ( (!isThreadOpenned) && 
                                <button onClick={handleUnPin}>
                                    <FontAwesomeIcon style={{ height: '18px' }} icon={faThumbtackSlash} />
                                    <span>UnPin</span>
                                </button>
                            )}
                            {message.senderId === user.id &&  (<button className='danger' onClick={handleDelete}>
                                <FontAwesomeIcon style={{ height: '18px' }} icon={faTrash} />
                                <span>Delete</span>
                            </button>)}
                        </div>
                    </div>
                )}
            </div>
            {message.replies && message.replies.length > 0 &&<div className={`num-replies ${message.senderId === user.userId 
                    ? (isThreadOpenned ? 'sender thread' : 'sender') 
                    : 'reciever'}`}>
                {message.replies?.length} replies
            </div>}
        </div>
    )
}

export default ChatMessage
