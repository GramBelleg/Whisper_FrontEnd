import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './BlockedUsers.css';
import { faArrowLeft, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '@/contexts/ModalContext';
import BlockUserModal from '../Modals/BlockUserModal/BlockUserModal';
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';
import { blockedUsersAPI, setBlockedStateForUser } from '@/services/blockedUsersService';
import useFetch from '@/services/useFetch';
import noUser from '../../assets/images/no-user.png'

const BlockedUsers = () => {

    const {data: blockedUsers, loading, error, refresh} = useFetch(blockedUsersAPI.index);

    const {openModal, openConfirmationModal} = useModal();
    const { pop } = useStackedNavigation();

    const blockUser = async (chat) => {
        await setBlockedStateForUser(chat.othersId ? chat.othersId : chat.other.id, true);
        refresh();
    }

    const unblockUser = async (userId) => {
        await setBlockedStateForUser(userId, false);
        refresh();
    }

    const addBlockedUser = () => {
        openModal(<BlockUserModal  blockUser={(chat)=> {blockUser(chat)}} />);
    };

    const cancelBlockUser = (user) => {
        openConfirmationModal("Are you sure you want to unblock this user?", () => {unblockUser(user.userId)});
    }
    return (
        <div id='blocked-users'>
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon onClick={() => {pop()}}  className='back-icon' icon={faArrowLeft} />
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
                        <div key={index} className="user-item" data-testid="user-item" onClick={() => {cancelBlockUser(user)}}>
                            <div className="user-avatar">
                                <img
                                    src={user.profilePic ? user.profilePic : noUser}
                                    alt={user.userName}
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
            <button className="add-new-button" data-testid="add-blocked-user-button" onClick={addBlockedUser}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
};

export default BlockedUsers;