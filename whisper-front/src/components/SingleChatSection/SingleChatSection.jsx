import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList'
import ChatActions from '../ChatActions/ChatActions'
import { useChat } from '@/contexts/ChatContext'
import NoChatOpened from '../NoChatOpened/NoChatOpened'

const SingleChatSection = () => {
    const {currentChat} = useChat();

    if (!currentChat) {
        return (<NoChatOpened />);
    }
    return (
        <div className='single-chat-container'>
            <div className='single-chat-header shadow-md'>
                <div className='header-avatar'>
                    <img src={currentChat.profilePic} alt={currentChat.sender} />
                </div>
                <div className='header-details'>
                    <span className='header-title'>{currentChat.sender}</span>
                    <span className='header-subtitle'>Last seen at {currentChat.lastSeen}</span>
                </div>
                <div className='header-icons'>
                    <FontAwesomeIcon style={{height:'24px'}} className='icon' icon={faSearch} />
                    <FontAwesomeIcon style={{height:'24px'}} className='icon' icon={faPhone} />
                    <FontAwesomeIcon style={{height:'24px'}} className='icon' icon={faEllipsisV} />
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
