import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'

const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [userDetails, setUserDetails] = useState({})
    

    const {data:userDetailsFromBack, loading, error} = useFetch('/userDetails');
    
    const sendMessage = (type, message) => {

        if(type === messageTypes.TEXT) {
            // Todo: do the call
            console.log("call ", message);
        }
    }

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping);
    }

    useEffect(() => {
        if(userDetailsFromBack && !error && !loading)
            setUserDetails(userDetailsFromBack);
    }, [userDetailsFromBack])
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
                <SingleChatMessagesList user={selectedUser}/>
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    <div className='input-container shadow'>
                        <div className="textmessage-emoji-container">
                            <SingleChatMessaging updateIconSend={updateIconSend} sendMessage={sendMessage}/>
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
