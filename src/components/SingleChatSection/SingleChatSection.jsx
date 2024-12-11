import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faPhone } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'
import { useEffect, useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import GroupInfoContainer from '../GroupInfo/GroupInfoContainer'

const SingleChatSection = () => {
    const { currentChat, pinnedMessages } = useChat()
    const [infoOpen, setInfoOpen] = useState(false)
    useEffect(() => {}, [pinnedMessages])

    const handlePinnedClick = (event) => {
        const messageId = event.messageId; 
    
        const targetElement = document.getElementById(`message-${messageId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            console.log("Target message not found:", messageId);
        }
    };
       
    if (!currentChat) {
        return <NoChatOpened />
    }

    return (
        <div className='single-chat-container'>
            <ChatHeader handleInfoOpen={ () => setInfoOpen(true) }/>
            <div className='messages'>
                <SingleChatMessagesList />
                {pinnedMessages.length > 0 && (
                    <div>
                        <PinnedMessages onGoToMessage={handlePinnedClick} />
                    </div>
                )}
            </div>

            <div className='w-full flex items-center justify-center'>
                {((currentChat.participantKeys && currentChat.participantKeys[0] && currentChat.participantKeys[1]) || currentChat.type != "DM") ? <ChatActions /> : 
                <div className='flex items-center justify-center mb-3 p-4 text-white'>
                    Waiting for the other participant to join the chat to exchange keys for secure communication
                </div>
                }
            </div>
            <div>
            {infoOpen && currentChat.type === "GROUP" && 
            <GroupInfoContainer currentChat={currentChat} onClose={()=>setInfoOpen(false)} />}
            </div>
        </div>
    )
}

export default SingleChatSection
