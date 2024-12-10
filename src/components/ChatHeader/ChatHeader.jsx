import { useEffect, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import "./ChatHeader.css";
import SearchSingleChat from "../SearchSingleChat/SearchSingleChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash, faEllipsisV, faPhone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { muteChat, unMuteChat } from "@/services/chatservice/muteUnmuteChat";
import { useWhisperDB } from "@/contexts/WhisperDBContext";

const ChatHeader = () => {
    const { currentChat, leaveGroup, setChatAltered, handleMute, handleUnMute } = useChat()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { dbRef } = useWhisperDB()

    const myHandleMute = async () => {
        setIsDropdownOpen(false)
        try {
            await handleMute(currentChat.id, currentChat.type)
        } catch  (error) {
            console.log(error)
        }
    }

    const myHandleUnMute = async () => {
        setIsDropdownOpen(false)
        try {
            await handleUnMute(currentChat.id, currentChat.type)
        } catch  (error) {
            console.log(error)
        }
    }

    const handleDelete = () => {
        // TODO: after back finishes
        console.log("Chat deleted")
        setIsDropdownOpen(false)
    }

    const handleLeave = () => {
        console.log("Chat left")
        leaveGroup(currentChat.id)
        setIsDropdownOpen(false)
    }


    return (
        <div className="single-chat-header shadow-md">
            <div className="header-avatar">
                <img src={currentChat.profilePic} alt={currentChat.name} />
            </div>
            <div className="header-details">
                <span className="header-title">{currentChat.name}</span>
                {currentChat.type === "DM" && (
                    <span className="header-subtitle">Last seen at {currentChat.lastSeen}</span>
                )}
            </div>
            <SearchSingleChat />
            <div className="header-icons">
                <FontAwesomeIcon style={{ height: "24px" }} className="icon" icon={faPhone} />
                <div className="dropdown-container">
                    <FontAwesomeIcon
                        style={{ height: "24px" }}
                        className="icon"
                        icon={faEllipsisV}
                        onClick={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && (
                        <div className="dropdown-menu"
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            {
                                !currentChat.isMuted ? 
                                <div className="dropdown-item" onClick={myHandleMute}>
                                    <FontAwesomeIcon style={{ height: "20px" }} className="menu-icon" icon={faBell} />
                                    <span>Mute Chat</span>
                                </div> :
                                <div className="dropdown-item" onClick={myHandleUnMute}>
                                    <FontAwesomeIcon style={{ height: "20px" }} className="menu-icon" icon={faBellSlash} />
                                    <span>Unmute Chat</span>
                                </div>
                            }
                            
                            { 
                                currentChat.type !== "GROUP" && 
                                <div className="dropdown-item" onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: "20px", color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}} >Delete Chat</span>
                                </div>
                            }
                            { 
                                currentChat.type === "GROUP" && currentChat.isAdmin && 
                                <div className="dropdown-item" onClick={handleDelete}>
                                    <FontAwesomeIcon style={{ height: "20px" , color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}}>Delete Group</span>
                                </div>
                            }
                            { 
                                currentChat.type === "GROUP" && !currentChat.isAdmin && 
                                <div className="dropdown-item" onClick={handleLeave}>
                                    <FontAwesomeIcon style={{ height: "20px" ,color: "red"}} className="menu-icon" icon={faTrash} />
                                    <span style={{color:"red"}}>Leave Group</span>
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
