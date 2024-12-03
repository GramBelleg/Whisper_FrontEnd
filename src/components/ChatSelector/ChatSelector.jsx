import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faUsers } from '@fortawesome/free-solid-svg-icons'
import useFetch from '@/services/useFetch'
import { handleNoUserImage } from '@/services/chatservice/addDefaultImage'
import './ChatSelector.css'
import { useModal } from '@/contexts/ModalContext'
import { getChatsCleaned } from '@/services/chatservice/getChats'

const ChatSelector = ({ onChatSelect, searchPlaceholder = 'Search chats...', renderCustomHeader, className = '' }) => {
    const [filters, setFilters] = useState({ keyword: '', usersOnly: 1, unblockedOnly: 1 })
    const [chatList, setChatList] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)
    const [errorChats, setErrorChats] = useState(null)

    const { closeModal } = useModal()

    const handleSearch = (e) => {
        setFilters((prev) => ({ ...prev, keyword: e.target.value }))
    }

    useEffect(() => {
        const loadChats = async () => {
            setLoadingChats(true)
            try {
                let chats = await getChatsCleaned(filters)
                setChatList(chats)
            } catch (error) {
                setErrorChats(error.message)
            } finally {
                setLoadingChats(false)
            }
        }

        loadChats()
    }, [filters])

    const renderChatItem = (chat, index) => {
        return (
            <div key={index} className='chat-item' onClick={() => onChatSelect(chat)}>
                <div className='chat-avatar'>
                    <img src={chat.picture} alt={chat.name} onError={handleNoUserImage} />
                    {chat.group && (
                        <span className='group-indicator'>
                            <FontAwesomeIcon icon={faUsers} />
                        </span>
                    )}
                </div>
                <div className='chat-info'>
                    <div className='chat-header'>
                        <h3>{chat.name}</h3>
                    </div>
                    <span className='last-seen'>{chat.group ? 'Group' : `Last seen ${chat.lastSeen}`}</span>
                </div>
            </div>
        )
    }

    return (
        <div className={`chat-selector ${className}`}>
            {renderCustomHeader?.()}
            <div className='search-container'>
                <span className='close-icon'>
                    <FontAwesomeIcon icon={faTimes} onClick={closeModal} />
                </span>
                <input
                    type='text'
                    placeholder={searchPlaceholder}
                    value={filters.keyword}
                    onChange={handleSearch}
                    className='search-input'
                />
            </div>

            <div className='chats-container'>
                {loadingChats ? (
                    <div className='loading'>Loading chats...</div>
                ) : errorChats ? (
                    <div className='error'>Failed to load chats</div>
                ) : chatList?.length === 0 ? (
                    <div className='no-results'>No chats found</div>
                ) : (
                    chatList.map(renderChatItem)
                )}
            </div>
        </div>
    )
}

export default ChatSelector
