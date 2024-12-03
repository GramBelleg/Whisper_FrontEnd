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
import { whoAmI } from '../../services/chatservice/whoAmI'
import PendingSend from '../PendingSend/PendingSend'
import { useChat } from '@/contexts/ChatContext'
import { muteChat, unMuteChat } from '@/services/chatservice/muteUnmuteChat'
import { useWhisperDB } from '@/contexts/WhisperDBContext'

const ChatItem = ({ index, standaloneChat }) => {
    const { dbRef } = useWhisperDB()
    const { selectChat, action, setActionExposed, messageDelivered } = useChat()

    const maxLength = standaloneChat.muted ? 33 : standaloneChat.name === whoAmI.name ? 30 : 15

    const [isOverflowing, setIsOverflowing] = useState(false)

    const userNameRef = useRef(null)

    const trimName = (name) => {
        if (name) return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name
        return ''
    }

    // The local obhect of the chat
    const [myChat, setMyChat] = useState({
        id: -1,
        senderId: -1,
        type: '',
        unreadMessageCount: 0,
        lastMessageId: -1,
        lastMessage: '',
        name: '',
        lastSeen: '',
        muted: false,
        media: false,
        messageState: -1,
        messageTime: '',
        messageType: '',
        tagged: false,
        group: false,
        story: false,
        othersId: -1,
        profilePic: '',
        drafted: false
    })

    // Function to handle clicks and call chooseChat
    const handleClick = (e) => {
        // Check if the click is on the Info component
        const infoElement = e.target.closest('.info')
        if (!infoElement) {
            selectChat(myChat)
        }
    }

    const handleMute = async (duration = 0) => {
        try {
            await muteChat(standaloneChat.id, {
                type: standaloneChat.type,
                isMuted: true,
                duration: duration
            })

            try {
                await dbRef.current.muteNotifications(standaloneChat.id)
            } catch (error) {
                console.error(error)
            }
            setActionExposed(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnMute = async (duration = 0) => {
        try {
            await unMuteChat(standaloneChat.id, {
                type: standaloneChat.type,
                isMuted: false,
                duration: duration
            })

            try {
                await dbRef.current.unMuteNotifications(standaloneChat.id)
            } catch (error) {
                console.error(error)
            }
            setActionExposed(true)
        } catch (error) {
            console.log(error)
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
                setIsOverflowing(scrollWidth > clientWidth) // Update overflow state
            }
        }

        checkOverflow()
        window.addEventListener('resize', checkOverflow)
        return () => {
            window.removeEventListener('resize', checkOverflow)
        }
    }, [standaloneChat])

    useEffect(() => {}, [action, messageDelivered])

    return (
        <div data-testid='chat-item' className='single-chat' onClick={handleClick}>
            {
                <div className='single-chat-content'>
                    <div className={`profile-pic-wrapper ${myChat.story ? 'has-story' : ''}`}>
                        <img
                            src={myChat.profilePic}
                            className={`profile-pic`} // Add the conditional class
                            onError={(e) => handleNoUserImage(e)}
                        />
                    </div>

                    <div className='content'>
                        <div className='user-info'>
                            <div className='name-container'>
                                <p
                                    ref={userNameRef} // Attach the ref to the user name element
                                    className={`user-name ${myChat.muted ? 'muted' : ''} ${isOverflowing ? 'overflow' : ''} ${index ? 'hovered' : ''}`} // Add overflow class conditionally
                                >
                                    {myChat.name}
                                </p>
                                {myChat.muted && (
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
                            {myChat.lastMessage && <LastMessage myChat={myChat} index={index} />}
                            {(myChat.unreadMessageCount || myChat.tagged) && (
                                <UnRead unReadMessages={myChat.unreadMessageCount} tag={myChat.tagged} />
                            )}
                            <Info index={index} group={myChat.group} muted={myChat.muted} onMute={handleMute} onUnMute={handleUnMute} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatItem
