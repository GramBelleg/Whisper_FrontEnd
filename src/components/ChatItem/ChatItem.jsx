import { useState, useEffect, useRef } from 'react'
import { checkDisplayTime } from '../../services/chatservice/checkDisplayTime'
import { handleNoUserImage } from '../../services/chatservice/addDefaultImage'
import NotificationBell from '../NotificationBell/NotificationBell'
import ReadTicks from '../ReadTicks/ReadTicks'
import SentTicks from '../SentTicks/SentTicks'
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks'
import LastMessage from '../LastMessage/LastMessage'
import UnRead from '../UnRead/UnRead'
import Info from '../Info/Info'
import './ChatItem.css'
import PendingSend from '../PendingSend/PendingSend'
import { useChat } from '@/contexts/ChatContext'
import { muteChat, unMuteChat } from '@/services/chatservice/muteUnmuteChat'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import useAuth from '@/hooks/useAuth'
import LoadingData from '../LoadingData/LoadingData'

const ChatItem = ({ index, standaloneChat }) => {
    const { dbRef } = useWhisperDB()
    const { selectChat, chatAltered } = useChat()
    const { user } = useAuth()

    const maxLength = standaloneChat.isMuted ? 33 : standaloneChat.name === user.name ? 30 : 15

    const [isOverflowing, setIsOverflowing] = useState(false)
    const [myChat, setMyChat] = useState(null)
    const userNameRef = useRef(null)

    const trimName = (name) => {
        if (name) return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name
        return ''
    }

    const handleClick = (e) => {
        const infoElement = e.target.closest('.info')
        if (!infoElement) {
            selectChat(standaloneChat)
        }
    }

    useEffect(() => {
        setMyChat((prevChat) => ({
            ...prevChat,
            ...standaloneChat,
            messageTime: checkDisplayTime(standaloneChat.messageTime),
            name: trimName(standaloneChat.name)
        }))

        const checkOverflow = () => {
            if (userNameRef.current) {
                const { scrollWidth, clientWidth } = userNameRef.current
                setIsOverflowing(scrollWidth > clientWidth) 
            }
        }

        checkOverflow()
        window.addEventListener('resize', checkOverflow)
        return () => {
            window.removeEventListener('resize', checkOverflow)
        }
    }, [standaloneChat])


    if (!myChat) {
        return <LoadingData/>
    }

    return (
        
        <div data-testid='chat-item' className='single-chat' onClick={handleClick}>
            {
                <div className='single-chat-content'>
                    <div className={`profile-pic-wrapper ${myChat.hasStory ? 'has-story' : ''}`}>
                        <img
                            src={myChat.profilePic}
                            className={`profile-pic`} 
                            onError={(e) => handleNoUserImage(e)}
                        />
                    </div>

                    <div className='content'>
                        <div className='user-info'>
                            <div className='name-container'>
                                <p
                                    ref={userNameRef} 
                                    className={`user-name ${myChat.isMuted ? 'muted' : ''} ${isOverflowing ? 'overflow' : ''} ${index ? 'hovered' : ''}`} // Add overflow class conditionally
                                >
                                    {myChat.name}
                                </p>
                                {myChat.isMuted && (
                                    <div className='muted-bell' data-testid='notification-bell'>
                                        <NotificationBell />
                                    </div>
                                )}
                            </div>
                            <div className='ticks-info'>
                                <div className='tick'>
                                    {(myChat.messageState != null && myChat.messageState === 0 && <SentTicks data-testid='sent-tick' />) ||
                                        (myChat.messageState != null && myChat.messageState === 1 && (
                                            <DeliveredTicks data-testid='delivered-tick' />
                                        )) ||
                                        (myChat.messageState != null && myChat.messageState === 2 && (
                                            <ReadTicks data-testid='read-tick' />
                                        )) ||
                                        (myChat.messageState != null && myChat.messageState === 4 && (
                                            <PendingSend data-testid='pending-tick' />
                                        ))}
                                </div>
                                <div className='message-time'>
                                    <span className={myChat.unreadMessageCount ? 'unread-time' : ''}>{myChat.messageTime}</span>
                                </div>
                            </div>
                        </div>
                        <div className='messaging-info'>
                            <LastMessage myChat={myChat} index={index} />
                            {(myChat.unreadMessageCount || myChat.tagged) && (
                                <UnRead unReadMessages={myChat.unreadMessageCount} tag={myChat.tagged} />
                            )}
                            <Info id={myChat.id} index={index} group={myChat.type === "GROUP"} isAdmin={myChat.isAdmin} muted={myChat.isMuted} type={myChat.type}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatItem
