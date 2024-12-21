import { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import './ChatHeader.css'
import SearchSingleChat from '../SearchSingleChat/SearchSingleChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash, faClock, faEllipsisV, faGear, faInfo, faPhone, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import GroupInfoContainer from '../GroupInfo/GroupInfoContainer'
import SelfDestructModal from '../Modals/SelfDestructModel/SelfDestructModal'

const ChatHeader = ({ handleInfoOpen, infoOpen, handleVoiceCall }) => {
    const { currentChat, leaveGroup, handleMute, handleUnMute, deleteChat, isThreadOpenned } = useChat()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
    const [isMuteDropdownOpen, setMuteIsDropdownOpen] = useState(false)
    const { openModal, closeModal } = useModal()
     
    const myHandleMute = async () => {
        setMuteIsDropdownOpen(false)
        try {
            await handleMute(currentChat.id, currentChat.type,0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSetSelfDestruct = () => {
        openModal(<SelfDestructModal />)
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
        console.log('Chat deleted')
        deleteChat(currentChat.id)
        setIsDropdownOpen(false)
        setMuteIsDropdownOpen(false)
    }

    const handleLeave = () => {
        console.log('Chat left')
        leaveGroup(currentChat.id)
        setIsDropdownOpen(false)
        setMuteIsDropdownOpen(false)
    }

    const renderHeaderSubtitles = () => {
        return (
            <div className="header-details" onClick={handleInfoOpen}>
                <span className="header-title">{currentChat.name}</span>
                {currentChat.type === "DM" ? (
                    <span className="header-subtitle">
                        {currentChat.lastSeen && <span>Last seen at {currentChat.lastSeen}</span>}
                        {currentChat.selfDestruct && <span> - Self Destruct in {currentChat.selfDestruct} seconds</span>}
                    </span>
                ):(
                    currentChat.type === "GROUP" ?
                    (
                        <span className="header-subtitle">Members {currentChat.members?.length}</span>
                    ) : (
                        <span className="header-subtitle">Subscribers {currentChat.members?.length}</span>
                    )
                )}
            </div>
        )
    }   

    return (
        <div className='single-chat-header shadow-md'>
            <div className='header-avatar'>
                <img src={currentChat.profilePic} alt={currentChat.name} />
            </div>
            {renderHeaderSubtitles()}
            <SearchSingleChat />
            <div className='header-icons'>
                <FontAwesomeIcon onClick={handleVoiceCall} style={{ height: '24px' }} className='icon' icon={faPhone} />
                <div className='dropdown-container'>
                    {!infoOpen && !isThreadOpenned && <FontAwesomeIcon
                        style={{ height: "30px" , marginTop: "5px"}}
                        className="icon"
                        data-testid="test-ellipses"
                        icon={faEllipsisV}
                        onClick={() => setIsDropdownOpen(true)}
                    />}
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
                            
                            { 
                                currentChat.type === "DM" && 
                                <div className="dropdown-item" onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: "20px", color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}} >Delete Chat</span>
                                </div>
                            }
                            <div className="dropdown-item" onClick={handleSetSelfDestruct}>
                                <FontAwesomeIcon style={{ height: "20px"}} className="menu-icon" icon={faClock} />
                                <span >Set Self Destruct Timer</span>
                            </div>
                            { 
                                (currentChat.type === "GROUP" || currentChat.type === "CHANNEL") && currentChat.isAdmin && 
                                <div className="dropdown-item" onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: "20px" , color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}}>Delete {currentChat.type.toLowerCase()}</span>
                                </div>
                            }
                            { 
                                (currentChat.type === "GROUP" || currentChat.type === "CHANNEL") && !currentChat.isAdmin && 
                                <div className="dropdown-item" onClick={handleLeave}>
                                    <FontAwesomeIcon style={{ height: "20px" ,color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}}>Leave {currentChat.type.toLowerCase()}</span>
                                </div>
                            }
                        </div>
                    )}
                    {isMuteDropdownOpen && (
                        <div className='dropdown-menu' onMouseLeave={() => setMuteIsDropdownOpen(false)}>
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
            {}
        </div>
    )
}

export default ChatHeader
