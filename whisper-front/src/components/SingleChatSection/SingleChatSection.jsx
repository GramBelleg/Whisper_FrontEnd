import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import PinnedMessages from '../PinnedMessages/PinnedMessages'

const SingleChatSection = () => {
    const {currentChat} = useChat();
    console.log(currentChat);

    if (!currentChat) {
        return (<NoChatOpened />);
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
                <PinnedMessages pinnedMessages={currentChat.pinnedMessages}/>
                <div className='header-icons'>
                    <FontAwesomeIcon height={24} className='icon' icon={faSearch} fixedHeight />
                    <FontAwesomeIcon height={24} className='icon' icon={faPhone} fixedHeight />
                    <FontAwesomeIcon height={24} className='icon' icon={faEllipsisV} fixedHeight />
                </div>
            </div>
            <div className='messages'>
                <SingleChatMessagesList/>
            </div>

            <div className='w-full flex items-center justify-center'>
                <ChatActions/>
            </div>
        </div>
    )
}

export default SingleChatSection;
