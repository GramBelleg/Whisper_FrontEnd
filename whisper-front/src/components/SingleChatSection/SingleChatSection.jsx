import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'

const SingleChatSection = ({ selectedUser }) => {
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false);
    const [userDetails, setUserDetails] = useState({
        id: 1,
        name: 'John Doe',
        last_seen_at: '10:00:50'
    })

    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping);
    }

    useEffect(() => {
        // simpulate fetching chat data
        setUserDetails({
            id: 1,
            name: 'John Doe',
            profile_pic: './assets/images/Grambell.png',
            last_seen_at: '10:00:50'
        })
    }, [])
    return (
        <div className='single-chat-container'>
            <div className='single-chat-header shadow-md'>
                <div className='header-avatar'>
                    <img src={userDetails.profile_pic} alt={userDetails.name} />
                </div>
                <div className='header-details'>
                    <span className='header-title'>{userDetails.name}</span>
                    <span className='header-subtitle'>Last seen at {userDetails.last_seen_at}</span>
                </div>
                <div className='header-icons'>
                    <FontAwesomeIcon height={24} className='icon' icon={faSearch} />
                    <FontAwesomeIcon height={24} className='icon' icon={faPhone} />
                    <FontAwesomeIcon height={24} className='icon' icon={faEllipsisV} />
                </div>
            </div>
            <div className='messages'>

                {/*
                <div className='message sender shadow'>
                    <div className='message-text'>
                        I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of
                        Stavanger. Have you been to this city?
                    </div>
                    <div className='message-info'>
                        <span className='time'>12:51</span>
                        <span className='message-status'>
                            <SentTicks width='12px' />
                        </span>
                    </div>
                </div>

                <div className='message receiver shadow'>
                    <div className='message-text'>
                        I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of
                        Stavanger. Have you been to this city?
                    </div>
                    <div className='message-info'>
                        <span className='time'>12:51</span>
                    </div>
                </div>
                */}
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    <div className='input-container shadow'>
                        <div className='emojis-container'>
                            <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
                        </div>
                        <div className="message-input">
                            <SingleChatMessaging updateIconSend={updateIconSend}/>
                        </div>
                        <div className='attachements-container'>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                    </div>
                    <div className="voice-send-container">
                        {isTyping ? <FontAwesomeIcon icon={faPaperPlane}/> : <FontAwesomeIcon icon={faMicrophoneAlt} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleChatSection;
