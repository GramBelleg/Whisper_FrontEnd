import "./CreateGroupPageContainer.css";
import ChooseGroupMembers from "../ChooseGroupMembers/ChooseGroupMembers";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/contexts/SidebarContext";
import ChooseGroupInfo from "../ChooseGroupInfo/ChooseGroupInfo";

const CreateGroupPageContainer = () => {

    const [pageOrder, setPageOrder] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([])
    const { setActivePage } = useSidebar();

    const handleGoForward = () => {
        if (pageOrder === 0) {
            setPageOrder((prev) => prev + 1);
        } else {
            console.log("Group created");
            // TODO: Make socket call, receive it, select current chat to be the group
        }
    };

    const handleGoBackward = () => {
        if (pageOrder > 0) {
            setPageOrder((prev) => prev - 1);
        } else {
            setActivePage("chat");
        }
    };

    return (
        <div className="create-new-group">
            <div className="flex gap-4 items-center header">
                <FontAwesomeIcon data-testid="back-icon" className="back-icon" icon={faArrowLeft} onClick={handleGoBackward} />
                {pageOrder === 0 ? <h1>Choose Members</h1> : <h1>New Group</h1>}
            </div>
            <div className="content">
                {pageOrder === 0 ? <ChooseGroupMembers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/> : <ChooseGroupInfo selectedUsers={selectedUsers}/>}
            </div>
            <div className="forward-icon" onClick={handleGoForward}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
            
        </div>
    );
};

export default CreateGroupPageContainer;
