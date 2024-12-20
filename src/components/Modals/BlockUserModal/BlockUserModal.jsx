import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import './BlockUserModal.css'
import { useEffect, useState } from 'react'
import { getAllUsers } from '@/services/userservices/getAllUsers'

const BlockUserModal = ({ blockUser }) => {
    const { closeModal } = useModal()
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const triggerBlockUser = (userId) => {
        blockUser(userId)
        closeModal()
    }

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
          try {
            let users = await getAllUsers()
            setUsersList(users);
          } catch (error) {
            console.log(error)
            setError(error.message);
          } finally {
            setLoading(false);
          }
        }
        loadUsers();
      }, []);

      const renderUser = (user, index) => {
          return (
            <div
              key={index}
              className="chat-item"
              onClick={() => {triggerBlockUser(user.id)}}
            >
              <div className="chat-avatar">
                {
                  user.profilePic ? (
                    <img src={user.profilePic} alt={user.userName} />
                  ) : (
                    <NoProfile className='w-40 h-40 rounded-full object-cover' />
                  )
                }
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <h3>{user.userName}</h3>
                </div>
              </div>
            </div>
          );
        };

    return (
        <div className='block-user-modal chat-selector' data-testid='block-user-modal'>
            <div className='search-container'>
                <span className='close-icon'>
                    <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
                </span>
                <h1>
                    Block User
                </h1>
            </div>
            <div className="chats-container">
            {loading ? (
            <div className="loading">Loading users...</div>
            ) : error != null ? (
            <div className="error">{error}</div>
            ) : usersList?.length === 0 ? (
            <div className="no-results">No users found</div>
            ) : (
            usersList.map(renderUser)
            )}
        </div>
        </div>
    )
}

export default BlockUserModal
