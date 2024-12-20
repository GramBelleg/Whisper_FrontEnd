import "./CreateGroupPageContainer.css";
import ChooseGroupMembers from "../ChooseGroupMembers/ChooseGroupMembers";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/contexts/SidebarContext";
import ChooseGroupInfo from "../ChooseGroupInfo/ChooseGroupInfo";
import ChatSocket from "@/services/sockets/ChatSocket";
import useAuth from "@/hooks/useAuth";
import { uploadMedia } from "@/services/chatservice/media";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";

const CreateGroupPageContainer = () => {

    const [pageOrder, setPageOrder] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([])
    const { setActivePage, type } = useSidebar()
    const chatsSocket = new ChatSocket()
    const [batchName, setBatchName] = useState('')
    const [groupPicFileData, setGroupPicFileData] = useState(null)
    const { user } = useAuth()
    const { openModal, closeModal } = useModal()
    const [loading, setLoading] = useState(false)

    const createBatch = async () => {
        try {
            if (batchName.length > 0) {
                setLoading(true)
                let blobName = null;
                if (groupPicFileData) {
                    blobName = await uploadMedia(groupPicFileData)
                }
                chatsSocket.createChat({
                    type: type,
                    name: batchName,
                    users: [...selectedUsers.map((selectedUser) => selectedUser.id), user.id],
                    picture: blobName,
                    senderKey: null
                })
                setLoading(false)
            } else {
                openModal(
                    <ErrorMesssage
                        errorMessage={"Please Specify the Name"}
                        appearFor={2000}
                        onClose={closeModal}
                    />
                )
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleGoForward = async () => {
        if (pageOrder === 0) {
            setPageOrder((prev) => prev + 1)
        } else {
            try {
                await createBatch()  
            } catch (error) {
                console.log("couldn't create batch")
            }
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
                {pageOrder === 0 ? <h1>Choose Members</h1> : (type === "GROUP" ? <h1>New Group</h1> : <h1>New Channel</h1>)}
            </div>
            <div className="content">
                {pageOrder === 0 ? <ChooseGroupMembers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/> 
                : <ChooseGroupInfo selectedUsers={selectedUsers} setBatchName={setBatchName} setGroupPicFileData={setGroupPicFileData}/>}
            </div>
            {!loading ?
                <div className="forward-icon" onClick={handleGoForward}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
                :
                <div className='flex items-center justify-center'>
                    <div 
                        className='animate-spin rounded-full border-b-2' 
                        style={{ height: '20px', width: '20px', borderColor: 'var(--accent-color)' }} 
                    />
                </div>

            }            
        </div>
    );
};

export default CreateGroupPageContainer;
