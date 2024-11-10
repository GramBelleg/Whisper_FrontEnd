import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";
import useFetch from "@/services/useFetch";
import { handleNoUserImage } from "@/services/chatservice/addDefaultImage";
import "./ChatSelector.css";
import { useModal } from "@/contexts/ModalContext";

const ChatSelector = ({ 
  onChatSelect,
  searchPlaceholder = "Search chats...",
  renderCustomHeader,
  className = ""
}) => {
  const [filters, setFilters] = useState({ keyword: '' });
  const { data: chatList, error: errorChats, loading: loadingChats } = useFetch('/api/chats', filters);
  const { closeModal } = useModal();

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, keyword: e.target.value }));
  };

  const renderChatItem = (chat, index) => {
    return (
      <div
        key={index}
        className="chat-item"
        onClick={() => onChatSelect(chat)}
      >
        <div className="chat-avatar">
          <img
            src={chat.picture}
            alt={chat.name}
            onError={handleNoUserImage}
          />
          {chat.group && <span className="group-indicator"><FontAwesomeIcon icon={faUsers} /></span>}
        </div>
        <div className="chat-info">
          <div className="chat-header">
            <h3>{chat.name}</h3>
          </div>
          <span className="last-seen">
            {chat.group ? 'Group' : `Last seen ${chat.lastSeen}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`chat-selector ${className}`}>
      {renderCustomHeader?.()}
      <div className="search-container">
        <span className="close-icon">
        <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.keyword}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="chats-container">
        {loadingChats ? (
          <div className="loading">Loading chats...</div>
        ) : errorChats ? (
          <div className="error">Failed to load chats</div>
        ) : chatList?.length === 0 ? (
          <div className="no-results">No chats found</div>
        ) : (
          chatList.map(renderChatItem)
        )}
      </div>
    </div>
  );
};

export default ChatSelector;