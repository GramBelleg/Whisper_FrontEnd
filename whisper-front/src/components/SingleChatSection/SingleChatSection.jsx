import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList';
import usePost from '../../services/usePost';


const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [messageToSend, setMessageToSend] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    

    const {data:userDetailsFromBack, loading, error} = useFetch('/userDetails');
    const { data: messages, loading: messagesLoading, error: messagesError} = useFetch('/userMessages');
    const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend);

    const sendMessage = (type, message) => {
        if(type === messageTypes.TEXT) {
        const tempMessageObject = {
            content: message,
            chatId: 3,
            type: type,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            sender: 1,
            time: new Date().toLocaleTimeString(),
            state: "pending" // until back responds
        }
            setMessageToSend(tempMessageObject);
            setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages]);
        }
    }

    

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping);
    }

    useEffect(() => {
        if(userDetailsFromBack && !error && !loading)
            setUserDetails(userDetailsFromBack);

        if(messages && !messagesError && !messagesLoading)
            setLocalMessages(messages);
    }, [userDetailsFromBack, messages])
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
                <SingleChatMessagesList user={selectedUser} messages={localMessages}/>
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
