import { faUserGroup, faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreateNewChat.css"
const CreateNewChat = ({ myOnMouseLeave, handleCreateGroupClick, handleCreatePrivateClick, handleCreateChannelClick, handleAddNewContact }) => {
    return (
        <div
            className="create-new-chat-drop-down"
            onMouseLeave={myOnMouseLeave}
        >
            <ul>
                <li onClick={handleCreateChannelClick}>
                        <FontAwesomeIcon icon={faBullhorn} />
                        <span>New Channel</span>
                </li>
                <li onClick={handleCreateGroupClick}>
                        <FontAwesomeIcon icon={faUserGroup} />
                        <span>New Group</span>
                </li>
                <li onClick={handleCreatePrivateClick}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>New Private Chat</span>
                </li> 
                <li onClick={handleAddNewContact}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>New Contact</span>
                </li> 
            </ul>
        </div>
    );
};

export default CreateNewChat;
