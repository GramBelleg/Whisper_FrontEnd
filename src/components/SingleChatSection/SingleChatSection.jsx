import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faPhone } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'
import SearchSingleChat from '../SearchSingleChat/SearchSingleChat'
import { useEffect, useState } from 'react'
import { generateVoiceCallToken } from '@/services/voiceCall/generateToken'
import useAuth from '@/hooks/useAuth'
import useVoiceCall from '@/hooks/useVoiceCall'
import VoiceCallHeader from '../VoiceCall/VoiceCallHeader'
import useChatEncryption from '@/hooks/useChatEncryption'
import ChatHeader from '../ChatHeader/ChatHeader'
import ThreadsBar from '../Threads/ThreadsBar'
import ChatInfoPage from '@/pages/ChatInfoPage'
import ChatSearchContainer from '../ChatSearch/ChatSearchContainer'

const SingleChatSection = () => {
    const { currentChat, pinnedMessages, handlePinnedClick,
         isThreadOpenned, setIsThreadOpenned, setThreadMessage } = useChat()
    const [infoOpen, setInfoOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const { startCall, inCall } = useVoiceCall();
    const {user} = useAuth();
    const {getVoiceCallSymmetricKey} = useChatEncryption()

    const handleVoiceCall = async () => {
        let token = await generateVoiceCallToken(currentChat.id, user.id)

        if (!token) {
            console.error('Failed to generate voice call token')
            return
        }

        let symmetricKey = ''
        if (currentChat.type == 'DM') {
            symmetricKey = await getVoiceCallSymmetricKey(currentChat)
        }

        startCall(currentChat.id, token, symmetricKey)
    }

    const handleMyPinnedClick = (event) => {
        const messageId = event.messageId; 
        handlePinnedClick(messageId)
    };
    const handleInfoOpen = ()=>
    {
        setInfoOpen(true)
        setSearchOpen(false)
    }


       
    if (!currentChat) {
        return (
            <div className='flex flex-col w-full h-full items-center'>
                {inCall && <VoiceCallHeader />}
                <NoChatOpened />
            </div>
        )
    }

    return (
        <div className='threads-chat-container'>
            <div className='single-chat-container'>
            <ChatHeader infoOpen={infoOpen}  handleVoiceCall={handleVoiceCall} handleInfoOpen={handleInfoOpen} 
                handleSearchOpen={ () => setSearchOpen(true) } isSearchOpen={searchOpen}/>
            {inCall && <VoiceCallHeader />}
                <div className='messages'>
                    <SingleChatMessagesList />
                    {pinnedMessages.length > 0 && (
                        <div>
                            <PinnedMessages onGoToMessage={handleMyPinnedClick} />
                        </div>
                    )}
                </div>

                {/*TODO: when channel is implemented, switch the conditions */}
                <div className='w-full flex items-center justify-center'>
                    {(!currentChat.isBlocked && !currentChat.makeBlocked && currentChat.participantKeys && currentChat.participantKeys[0] && currentChat.participantKeys[1]) ||
                    currentChat.type === 'GROUP' ||
                    (currentChat.type === 'CHANNEL' && currentChat.isAdmin) ? (
                        <ChatActions />
                    ) : currentChat.type === 'CHANNEL' && !currentChat.isAdmin ? (
                        <div className='flex items-center justify-center mb-3 p-4 text-light bg-dark shadow-lg rounded-lg'>
                            Only admins can post to channels
                        </div>
                    ) : !currentChat.isBlocked && !currentChat.makeBlocked ? (
                        <div className='flex items-center justify-center mb-3 p-4 text-white'>
                            Waiting for the other participant to join the chat to exchange keys for secure communication
                        </div>
                    ) : (
                        <div className='flex items-center justify-center mb-3 p-4 text-white'>You can't communicate with this user due to a block</div>
                    )}
                </div>
                <div>
                {infoOpen && (currentChat.type === "GROUP" || currentChat.type === "CHANNEL") && 
                <ChatInfoPage currentChat={currentChat} onClose={()=>setInfoOpen(false)} />}
                { searchOpen &&
                    <ChatSearchContainer 
                        onClose={()=>setSearchOpen(false)} 
                        handleSearchMessageClick={handlePinnedClick}/>
                    }
                </div>
            </div>
            <div className='Threads'>
                {isThreadOpenned && (
                    <ThreadsBar
                        onClose={() => {
                            setThreadMessage(null)
                            setIsThreadOpenned(false)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default SingleChatSection
