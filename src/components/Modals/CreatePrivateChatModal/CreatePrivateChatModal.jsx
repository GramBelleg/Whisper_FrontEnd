import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { handleNoUserImage } from "@/services/chatservice/addDefaultImage";
import { useModal } from "@/contexts/ModalContext";
import { searchUsers } from "@/services/userservices/searchUsers";
import "./CreatePrivateChatModal.css";
import ChatSocket from "@/services/sockets/ChatSocket";
import useAuth from "@/hooks/useAuth";
import { generateKeyPair } from "@/services/encryption/keyManager";
import axiosInstance from "@/services/axiosInstance";
import { useWhisperDB } from "@/contexts/WhisperDBContext";


const CreatePrivateChatModal = () => {
  const { user:authUser } = useAuth();
  const [keyword, setKeyword] = useState('');
  
  const { dbRef } = useWhisperDB();
  const chatSocket = useMemo(() => new ChatSocket(),[]);
  const [usersList, setUsersList] = useState([
    {
      id: 2,
      screenName: "terrell herman",
      email: "",
      profilePic: "",
      userName: "joelle61",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { closeModal } = useModal();

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  const createSecretChat = async (user) => {
      let {privateKey, publicKey} = await generateKeyPair();

      let response = await axiosInstance.post('/api/encrypt',{
        key: publicKey,
        userId: authUser.id
      })
      
      const keyId = response.data;

      await dbRef.current.getKeysStore().storeKey(keyId,privateKey);

      chatSocket.createChat({
        type: "DM",
        users: [authUser.id, user.id],
        senderKey: keyId,
      });

      closeModal();

  }

  useEffect(() => {
    const loadUsers = async () => {
        setLoading(true);
      try {
        let users = await searchUsers(keyword)
        setUsersList(users); 
      } catch (error) {
        console.log(error)
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    // loadUsers();
  }, [keyword]);


  

  const renderUser = (user, index) => {
    return (
      <div
        key={index}
        className="chat-item"
        onClick={() => {createSecretChat(user)}}
      >
        <div className="chat-avatar">
          <img
            src={user.profilePic}
            alt={user.screenName}
            onError={handleNoUserImage}
          />
        </div>
        <div className="chat-info">
          <div className="chat-header">
            <h3>{user.screenName}</h3>
          </div>
          <span>
            {user.email}
          </span>
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
        <input
          type="text"
          placeholder={'Search Users...'}
          value={keyword}
          onChange={handleSearch}
          className="search-input"
        />
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