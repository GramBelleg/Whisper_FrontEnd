import { useEffect, useMemo, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEllipsisV,
    faMicrophoneAlt,
    faPaperclip,
    faPhone,
    faSearch,
    faPaperPlane,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList';
import usePost from '../../services/usePost';
import { whoAmI } from '../../services/chatservice/whoAmI'
import useVoiceRecorder from '@/hooks/useVoiceRecorder'
import { formatDuration } from '@/utils/formatDuration'


const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageToSend, setMessageToSend] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const {isRecording, duration, audioUrl, startRecording, stopRecording, discardRecording} = useVoiceRecorder()
    const [userDetails, setUserDetails] = useState({})


    
    const { data: messages, loading: messagesLoading, error: messagesError} = useFetch('/userMessages');
    const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend);
    const { data: userDetailsFromBack, loading, error } = useFetch('/userDetails')


    const showSendIcon = useMemo(() => isTyping || isRecording, [isTyping, isRecording])


    // TODO : move the message sending logic to the message component to handle failures and retrying
    const sendMessage = (type, message) => {
        const tempMessageObject = {
            id:4,
            chatId: localMessages.chatId,
            senderId: whoAmI.id,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            time:new Date().toLocaleTimeString(),
            state:"pending",
            othersId: selectedUser.userId,
        }

        if(isRecording) {
            stopRecording((url) => {
                // This will execute after the audio URL is available
                tempMessageObject.content = url; // Now it has the correct audio URL
                tempMessageObject.type = messageTypes.AUDIO;
                setMessageToSend(tempMessageObject)
                setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages])
            })
            return;
        }

        if (type === messageTypes.TEXT) {
            tempMessageObject.content = message
            tempMessageObject.type = messageTypes.TEXT
        }
            
        setMessageToSend(tempMessageObject);
        setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages]);
    }

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping)
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

        if (userDetailsFromBack && !error && !loading) setUserDetails(userDetailsFromBack)
            
    }, [messages, selectedUser, userDetailsFromBack])


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
                <SingleChatMessagesList user={selectedUser} messages={localMessages} />
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    <div className='input-container shadow transition-all'>
                        <div className='textmessage-emoji-container'>
                            <SingleChatMessaging updateIconSend={updateIconSend} sendMessage={sendMessage} />
                        </div>

                        {isRecording ? (
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-lg font-semibold">{formatDuration(duration)}</span>
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            </div>
                        ) : (
                            <div className='attachements-container'>
                                <FontAwesomeIcon icon={faPaperclip} />
                            </div>
                        )}
                    </div>
                    {isRecording && (
                        <div className='cancel-voice-recording' onClick={discardRecording}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                    )}
                    <div className={`voice-send-container ${showSendIcon ? 'active' : ''}`} onClick={showSendIcon ? sendMessage : startRecording}>
                        <FontAwesomeIcon
                            icon={showSendIcon ? faPaperPlane : faMicrophoneAlt}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleChatSection
