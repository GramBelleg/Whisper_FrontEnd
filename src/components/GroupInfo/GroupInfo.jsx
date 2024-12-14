import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import GroupSettings from "../GroupSettings/GroupSettings";
import GroupMembers from "../GroupMembers/GroupMembers";
import GroupMembersContainer from "../GroupMembers/GroupMembersContainer";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";


const GroupInfo = ({ currentChat, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { push } = useStackedNavigation()
    const handleClose = () => {
        setIsVisible(false); 
        setTimeout(() => {
            onClose(); 
        }, 300); 
    };

    useEffect(() => {
        setIsVisible(true); 
    }, []);

    
    const handleEdit = () => {
        push( <GroupSettings /> )
    }

    return (
        <div
            className={`fixed top-0 right-0 w-80 h-full bg-dark text-light shadow-lg z-200 p-4 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Group Info</h3>
                <div className="flex justify-between items-center space-x-4 ">
                <button className="text-light" onClick={handleEdit} data-testid="edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
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
            <div className="border-t border-gray-600 pt-4">
                    <GroupMembersContainer />
                
            </div>
        </div>
    );
};

export default GroupInfo;
