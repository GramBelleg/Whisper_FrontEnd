import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './BlockedUsers.css';
import { faArrowLeft, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import useFetch from '@/services/useFetch';
import { handleNoUserImage } from '@/services/chatservice/addDefaultImage';
import { useModal } from '@/contexts/ModalContext';
import BlockUserModal from '../Modals/BlockUserModal/BlockUserModal';

const BlockedUsers = () => {
    const { data: blockedUsers, error, loading } = useFetch('/api/user/blocked');

    const {openModal, openConfirmationModal} = useModal();

    const blockUser = () => {
        openModal(<BlockUserModal  blockUser={()=> {console.log('testing')}} />);
    };

    const cancelBlockUser = () => {
        openConfirmationModal("Are you sure you want to unblock this user?", () => {console.log('unblock user')});
    }
    return (
        <div id='blocked-users'>
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon className='back-icon' icon={faArrowLeft} />
                <h1>Blocked Users</h1>
                
            </div>
            <div className="users-container">
                {loading ? (
                    <div className="loading">Loading chats...</div>
                ) : error ? (
                    <div className="error">Failed to load</div>
                ) : blockedUsers?.length === 0 ? (
                    <div className="no-results">No Users found</div>
                ) : (
                    blockedUsers.map((user, index) => (
                        <div key={index} className="user-item" onClick={cancelBlockUser}>
                            <div className="user-avatar">
                                <img
                                    src={user.profilePic}
                                    alt={user.userName}
                                    onError={handleNoUserImage}
                                />
                            </div>
                            <div className="user-info">
                                <h3>{user.userName}</h3>
                                <FontAwesomeIcon className='cancel-icon' icon={faTimes} />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button className="add-new-button" onClick={blockUser}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
};

export default BlockedUsers;