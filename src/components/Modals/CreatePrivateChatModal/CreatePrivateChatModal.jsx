import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import NoProfile from '@/assets/images/no-profile.svg?react'
import { useModal } from "@/contexts/ModalContext";
import "./CreatePrivateChatModal.css";
import ChatSocket from "@/services/sockets/ChatSocket";
import useAuth from "@/hooks/useAuth";
import { generateKeyPair } from "@/services/encryption/keyManager";
import axiosInstance from "@/services/axiosInstance";
import { useWhisperDB } from "@/contexts/WhisperDBContext";
import { getAllUsers } from "@/services/userservices/getAllUsers";


const CreatePrivateChatModal = () => {
  const { user:authUser } = useAuth();
  const { dbRef } = useWhisperDB();
  const chatSocket = useMemo(() => new ChatSocket(),[]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { closeModal } = useModal();

  const createSecretChat = async (userId) => {
      let {privateKey, publicKey} = await generateKeyPair();

      let response = await axiosInstance.post('/api/encrypt',{
        key: publicKey,
        userId: authUser.id
      })
      
      const keyId = response.data;

      await dbRef.current.getKeysStore().storeKey(keyId,privateKey);

      chatSocket.createChat({
        type: "DM",
        users: [authUser.id, userId],
        senderKey: keyId,
      });

      closeModal();

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
        onClick={() => {createSecretChat(user.id)}}
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
    <div className="create-private-chat-modal">
    <div className={`chat-selector`}>
      <div className="search-container">
        <span className="close-icon">
        <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
        </span>
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
    </div>
  );
};

export default CreatePrivateChatModal;