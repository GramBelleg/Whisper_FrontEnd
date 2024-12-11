import { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import './ChatHeader.css'
import SearchSingleChat from '../SearchSingleChat/SearchSingleChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash, faEllipsisV, faGear, faPhone, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import GroupMembersContainer from '../GroupMembers/GroupMembersContainer'
import GroupSettings from '../GroupSettings/GroupSettings'
import GroupInfo from '../GroupInfo/GroupInfo'
import GroupInfoContainer from '../GroupInfo/GroupInfoContainer'

const ChatHeader = ({handleInfoOpen}) => {
    const { currentChat, leaveGroup, chatAltered, handleMute, handleUnMute } = useChat()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
    const [isMuteDropdownOpen, setMuteIsDropdownOpen] = useState(false)
    const { openModal, closeModal } = useModal()

    const myHandleMute = async (duration) => {
        setMuteIsDropdownOpen(false)
        try {
            await handleMute(currentChat.id, currentChat.type,duration)
        } catch (error) {
            console.log(error)
        }
    }

    const muteDuration = () => {
        setIsDropdownOpen(false)
        setMuteIsDropdownOpen(true)
    }

    const myHandleUnMute = async () => {
        setIsDropdownOpen(false)
        try {
            await handleUnMute(currentChat.id, currentChat.type)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = () => {
        // TODO: after back finishes
        console.log('Chat deleted')
        setIsDropdownOpen(false)
    }

    const handleViewMembers = () => {
        openModal(<GroupMembersContainer />)
        setIsDropdownOpen(false)
    }

    const handleSettings = () => {
        openModal(<GroupSettings />)
        setIsDropdownOpen(false)
    }

    const handleLeave = () => {
        console.log('Chat left')
        leaveGroup(currentChat.id)
        setIsDropdownOpen(false)
    }

    return (
        <div className='single-chat-header shadow-md'>
            <div className='header-avatar'>
                <img src={currentChat.profilePic} alt={currentChat.name} />
            </div>
            <div className='header-details' onClick={handleInfoOpen}>
                <span className='header-title'>{currentChat.name}</span>
                {currentChat.type === 'DM' && <span className='header-subtitle'>Last seen at {currentChat.lastSeen}</span>}
            </div>
            <SearchSingleChat />
            <div className='header-icons'>
                <FontAwesomeIcon style={{ height: '24px' }} className='icon' icon={faPhone} />
                <div className='dropdown-container'>
                    <FontAwesomeIcon
                        style={{ height: '24px' }}
                        className='icon'
                        icon={faEllipsisV}
                        onClick={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && (
                        <div className='dropdown-menu' onMouseLeave={() => setIsDropdownOpen(false)}>
                            {!currentChat.isMuted ? (
                                <div className='dropdown-item' onClick={muteDuration}>
                                    <FontAwesomeIcon style={{ height: '20px' }} className='menu-icon' icon={faBell} />
                                    <span>Mute Chat</span>
                                </div>
                            ) : (
                                <div className='dropdown-item' onClick={myHandleUnMute}>
                                    <FontAwesomeIcon style={{ height: '20px' }} className='menu-icon' icon={faBellSlash} />
                                    <span>Unmute Chat</span>
                                </div>
                            )}

                            {currentChat.type !== 'GROUP' && (
                                <div className='dropdown-item' onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: '20px', color: 'red' }} className='menu-icon' icon={faTrash} />
                                    <span style={{ color: 'red' }}>Delete Chat</span>
                                </div>
                            )}

                            {currentChat.type === 'GROUP' && currentChat.isAdmin && (
                                <div className='dropdown-item' onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: '20px', color: 'red' }} className='menu-icon' icon={faTrash} />
                                    <span style={{ color: 'red' }}>Delete Group</span>
                                </div>
                            )}
                            {currentChat.type === 'GROUP' && !currentChat.isAdmin && (
                                <div className='dropdown-item' onClick={handleLeave}>
                                    <FontAwesomeIcon style={{ height: '20px', color: 'red' }} className='menu-icon' icon={faTrash} />
                                    <span style={{ color: 'red' }}>Leave Group</span>
                                </div>
                            )}
                        </div>
                    )}
                    {isMuteDropdownOpen && (
                        <div className='dropdown-menu'>
                            <div className='dropdown-item' onClick={() => myHandleMute('8 Hours')}>
                                8 Hours
                            </div>
                            <div className='dropdown-item' onClick={() => myHandleMute('1 Week')}>
                                1 Week
                            </div>
                            <div className='dropdown-item' onClick={() => myHandleMute('Always')}>
                                Always
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isChatInfoOpen && currentChat.type === "GROUP" && 
            <GroupInfoContainer currentChat={currentChat}  onClose={()=>setIsChatInfoOpen(false)}/>}
        </div>
    )
}

export default ChatHeader
