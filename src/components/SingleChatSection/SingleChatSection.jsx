import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEllipsisV,
    faPhone,
} from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'
import SearchSingleChat from '../SearchSingleChat/SearchSingleChat'
import { useEffect } from 'react'
import { generateVoiceCallToken } from '@/services/voiceCall/generateToken'
import useAuth from '@/hooks/useAuth'
import useVoiceCall from '@/hooks/useVoiceCall'
import VoiceCallHeader from '../VoiceCall/VoiceCallHeader'
import useChatEncryption from '@/hooks/useChatEncryption'

const SingleChatSection = () => {
    const { currentChat, pinnedMessages } = useChat()
    useEffect(() => {}, [pinnedMessages])

    const { startCall, inCall } = useVoiceCall();
    const {user} = useAuth();
    const {getVoiceCallSymmetricKey} = useChatEncryption()

    const handleVoiceCall = async () => {
        let token = await generateVoiceCallToken(currentChat.id, user.id);
        
        if (!token) {
            console.error("Failed to generate voice call token");
            return;
        }

        let symmetricKey = "";
        if(currentChat.type == "DM") {
          symmetricKey = await getVoiceCallSymmetricKey(currentChat);
        }

        startCall(currentChat.id, token, symmetricKey);
    }

    const handlePinnedClick = (event) => {
        const messageId = event.messageId; // Retrieve the data-message-id
        console.log("Clicked on pinned message with ID:", messageId);
    
        const targetElement = document.getElementById(`message-${messageId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            console.log("Target message not found:", messageId);
        }
    };
       
    if (!currentChat) {
        return (
            <div className='flex flex-col w-full h-full items-center'>
                {inCall && <VoiceCallHeader />}
                <NoChatOpened />
            </div>
        )
    }



    return (
        <div className='single-chat-container'>
            <div className='single-chat-header shadow-md'>
                <div className='header-avatar'>
                    <img src={currentChat.profilePic} alt={currentChat.name} />
                </div>
                <div className='header-details'>
                    <span className='header-title'>{currentChat.name}</span>
                    <span className='header-subtitle'>Last seen at {currentChat.lastSeen}</span>
                </div>
                <SearchSingleChat />
                <div className='header-icons'>
                    <FontAwesomeIcon onClick={handleVoiceCall} style={{ height: '24px' }} className='icon' icon={faPhone} />
                    <FontAwesomeIcon style={{ height: '24px' }} className='icon' icon={faEllipsisV} />
                </div>
            </div>
            {inCall && <VoiceCallHeader />}
            <div className='messages'>
                <SingleChatMessagesList />
                {pinnedMessages.length > 0 && (
                    <div>
                        <PinnedMessages onGoToMessage={handlePinnedClick} />
                    </div>
                )}
            </div>

            <div className='w-full flex items-center justify-center'>
                {((currentChat.participantKeys[0] && currentChat.participantKeys[1]) || currentChat.type != "DM") ? <ChatActions /> : 
                <div className='flex items-center justify-center mb-3 p-4 text-white'>
                    Waiting for the other participant to join the chat to exchange keys for secure communication
                </div>
                }
            </div>
        </div>
    )
}

export default SingleChatSection
