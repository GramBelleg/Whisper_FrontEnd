import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faAdd } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import CopyButton from "../CopyButton/CopyButton";
import { useChat } from "@/contexts/ChatContext";
import ChannelSettings from "../ChannelSettings/ChannelSettings";
import GroupMembersContainer from "../GroupMembers/GroupMembersContainer";
import GroupAddMembers from "../GroupAddMembers/GroupAddMembers";

const ChannelInfo = ({ currentChat, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { push } = useStackedNavigation()
    const {handleGetChannelSettings} = useChat();
    const [channelInvite,setChannelInvite] = useState("http://ayhaga:5173/")

    const handleClose = () => {
        setIsVisible(false); 
        setTimeout(() => {
            onClose(); 
        }, 300); 
    };
    const handleAddUsers = () => {
        push(<GroupAddMembers type={"channel"}/> )
    }
    useEffect(() => {
        setIsVisible(true)
        const getChannelInvite = async () => {
            try {
                const response = await handleGetChannelSettings()
                setChannelInvite(response.inviteLink)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getChannelInvite()
    }, []);

    
    const handleEdit = () => {
        push( <ChannelSettings/> )
    }

    return (
        <div
            className={`fixed top-[2.5%] right-[4.5%] w-80 h-[100%] bg-dark text-light shadow-lg z-200 p-4 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-[200%]"
            }`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Channel Info</h3>
                <div className="flex justify-between items-center space-x-4 ">
                {
                    currentChat.isAdmin && 
                (
                    <div>
                        <button className="text-light" onClick={handleAddUsers} data-testid="add-button">
                            <FontAwesomeIcon icon={faAdd} />
                        </button>
                        <button className="text-light" onClick={handleEdit} data-testid="edit-button">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </div>
                )}
                <button className="text-white" onClick={handleClose} data-testid="close-button">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                </div>
            </div>
            <div className="mb-6">
                <img
                    src={currentChat.profilePic}
                    alt={currentChat.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h4 className="text-lg text-center">{currentChat.name}</h4>
                <p className="text-center text-sm text-gray-400">{currentChat.type}</p>
            </div>
            <h3 className='text-left text-sm text-gray-400'>Invitation Link</h3>
            <div className="flex flex-row justify-between">
                <h3 className="pr-6 truncate max-w-[calc(100%-3rem)]" title={channelInvite}>
                    {channelInvite}
                </h3>
                <CopyButton content={channelInvite} />
            </div>

            <div className="border-t border-gray-600 pt-4">
                <GroupMembersContainer chatType={"channel"} />
            </div>
        </div>
    );
};

export default ChannelInfo;
