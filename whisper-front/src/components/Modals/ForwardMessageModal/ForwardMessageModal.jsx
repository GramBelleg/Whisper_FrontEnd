import { useState } from "react";
import "./ForwardMessageModal.css";
import useFetch from "@/services/useFetch";
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useChat } from "@/contexts/ChatContext";
import parentRelationshipTypes from "@/services/chatservice/parentRelationshipTypes";

const ForwardMessageModal = ({ message }) => {
    const [filters, setFilters] = useState({ keyword: '' });
    const { data: chatList, error: errorChats, loading: loadingChats } = useFetch('/chats', filters);
    const { updateParentMessage, selectChat } = useChat();
    const handleForward = (chat) => {
        selectChat(chat);
        updateParentMessage(message, parentRelationshipTypes.FORWARD);
        closeModal();
    };

    const { closeModal } = useModal();

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, keyword: e.target.value }));
    };

    const renderChatItem = (chat, index) => {
        return (
            <div 
                key={index} 
                className="chat-item" 
                onClick={() => handleForward(chat)}
            >
                <div className="chat-avatar">
                    <img 
                        src={chat.picture} 
                        alt={chat.name}
                        onError={(e) => {
                            e.target.src = './assets/images/default-avatar.png';
                        }}
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
        <div className="forward-message-modal">
            <div className="search-container">
                <span className="close-icon">
                    <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
                </span>
                <input
                    type="text"
                    placeholder="Forward to..."
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

export default ForwardMessageModal;