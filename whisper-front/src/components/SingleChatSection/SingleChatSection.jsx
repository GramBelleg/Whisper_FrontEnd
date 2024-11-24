import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'
import SearchSingleChat from '../SearchSingleChat/SearchSingleChat'
import { useEffect } from 'react'

const SingleChatSection = () => {
    const { currentChat, pinnedMessages } = useChat();

    if (!currentChat) {
        return (<NoChatOpened />);
    }
    useEffect(() => {

    }, [pinnedMessages])
    
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
                <SearchSingleChat/>
                <div className='header-icons'>
                    <FontAwesomeIcon style={{height:'24px'}} className='icon' icon={faPhone} />
                    <FontAwesomeIcon style={{height:'24px'}} className='icon' icon={faEllipsisV} />
                </div>
            </div>
            <div className='messages'>
                <SingleChatMessagesList/>
                {
                    pinnedMessages.length > 0 && (
                        <div>
                            <PinnedMessages
                                onGoToMessage={(message) => console.log("Go to message", message)}
                            />
                        </div>
                    )
                }
            </div>

            <div className='w-full flex items-center justify-center'>
                <ChatActions/>
            </div>
        </div>
    )   
}

export default SingleChatSection;
