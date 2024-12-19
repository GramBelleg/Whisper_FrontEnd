import './SingleChatSection.css'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'
import { useEffect, useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import GroupInfoContainer from '../GroupInfo/GroupInfoContainer'
import ChannelInfoContainer from '../ChannelInfo/ChannelInfoContainer'
import ThreadsBar from '../Threads/ThreadsBar'

const SingleChatSection = () => {
    const { currentChat, pinnedMessages, isThreadOpenned, setIsThreadOpenned, setThreadMessage } = useChat()
    const [infoOpen, setInfoOpen] = useState(false)

    console.log(currentChat,"curr")

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
        <div className="threads-chat-container">
            <div className='single-chat-container'>
                <ChatHeader infoOpen={infoOpen} handleInfoOpen={() => setInfoOpen(true) }/>
                <div className='messages'>
                    <SingleChatMessagesList />
                    {pinnedMessages.length > 0 && (
                        <div>
                            <PinnedMessages onGoToMessage={handlePinnedClick} />
                        </div>
                    )}
                </div>
                
                {/*TODO: when channel is implemented, switch the conditions */}
                <div className='w-full flex items-center justify-center'>
                    {((currentChat.participantKeys && currentChat.participantKeys[0] && currentChat.participantKeys[1]) || currentChat.type === "GROUP" || (currentChat.type === "CHANNEL" && currentChat.isAdmin)) ? (<ChatActions />) : 
                        (
                            (currentChat.type === "CHANNEL" && !currentChat.isAdmin) ? <div className='flex items-center justify-center mb-3 p-4 text-light bg-dark shadow-lg rounded-lg'>Only admins can post to channels</div>
                            : (
                                <div className='flex items-center justify-center mb-3 p-4 text-white'>
                                    Waiting for the other participant to join the chat to exchange keys for secure communication
                                </div>
                            )
                        )
                    }
                </div>
                <div>
                {infoOpen && currentChat.type === "GROUP" && 
                <GroupInfoContainer currentChat={currentChat} onClose={()=>setInfoOpen(false)} />}
                {infoOpen && currentChat.type === "CHANNEL" && 
                <ChannelInfoContainer currentChat={currentChat} onClose={()=>setInfoOpen(false)} />}
                
                </div>
            </div>
            <div className='Threads'>
                {isThreadOpenned && <ThreadsBar onClose={() => {
                    setThreadMessage(null)
                    setIsThreadOpenned(false)}
                }/>}
            </div>
        </div>
    )
}

export default SingleChatSection
