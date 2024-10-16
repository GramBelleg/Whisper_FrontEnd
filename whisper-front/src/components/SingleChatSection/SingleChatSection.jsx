import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile } from '@fortawesome/free-solid-svg-icons'
import SentTicks from '../SentTicks/SentTicks'
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks'
import ReadTicks from '../ReadTicks/ReadTicks'
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker'

const SingleChatSection = ({ selectedUser }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [userDetails, setUserDetails] = useState({
        id: 1,
        name: 'John Doe',
        last_seen_at: '10:00:50'
    })

    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    const updateNewMessage = (event) => {
        setNewMessage(event.target.value)
    }

    useEffect(() => {
        // simpulate fetching chat data

        setMessages([
            {
                id: 1,
                sender: 'John Doe',
                message: 'Hello',
                datetime: '2024-10-13 10:00:50'
            },
            {
                id: 2,
                sender: 'John Doe',
                message: 'How are you?',
                datetime: '2024-10-05 10:00:51'
            },
            {
                id: 3,
                sender: 'John Doe',
                message: 'I am fine',
                datetime: '2024-10-13 10:00:52'
            }
        ])

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
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    <div className='input-container shadow'>
                        <div className='emojis-container'>
                            <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
                        </div>
                        <input
                            type='text'
                            value={newMessage}
                            onInput={updateNewMessage}
                            className='search-input'
                            placeholder='Message Here'
                        />
                        <div className='attachements-container'>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                    </div>
                    <div className='voice-container shadow'>
                        <FontAwesomeIcon icon={faMicrophoneAlt} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleChatSection
