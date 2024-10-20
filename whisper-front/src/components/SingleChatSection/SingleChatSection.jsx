import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList';
import usePost from '../../services/usePost';
import { whoAmI } from '../../services/chatservice/whoAmI'


const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageToSend, setMessageToSend] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    

    
    const { data: messages, loading: messagesLoading, error: messagesError} = useFetch('/userMessages');
    const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend);

    const sendMessage = (type, message) => {
        if(type === messageTypes.TEXT) {
            const tempMessageObject = {
                id:4,
                chatId: localMessages.chatId,
                senderId: whoAmI.id,
                content: message,
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:new Date().toLocaleTimeString(),
                state:"pending",
                othersId: selectedUser.userId,
            }
            setMessageToSend(tempMessageObject);
            setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages]);
        }
    }

    console.log("user" ,selectedUser)
    

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping);
    }

    useEffect(() => {

        if(messages && !messagesError && !messagesLoading) {
            console.log(messages)
            const thisChatMessages = messages.filter(
                (message) =>  message.othersId === selectedUser.userId
            );
            console.log(thisChatMessages)
            setLocalMessages(thisChatMessages);
        }
    }, [messages, selectedUser])
    return (
        <div className='single-chat-container'>
            <div className='single-chat-header shadow-md'>
                <div className='header-avatar'>
                    <img src={selectedUser.profilePic} alt={selectedUser.name} />
                </div>
                <div className='header-details'>
                    <span className='header-title'>{selectedUser.name}</span>
                    <span className='header-subtitle'>Last seen at {selectedUser.lastSeen}</span>
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
