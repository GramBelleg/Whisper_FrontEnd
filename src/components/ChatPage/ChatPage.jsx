import ChatList from '../ChatList/ChatList'
import './ChatPage.css'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SearchBar from '../SearchBar/SearchBar'
import { useState, useEffect, useCallback } from 'react'
import AddNewButton from '../AddNewButton/AddNewButton'
import { useChat } from '@/contexts/ChatContext'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'

const ChatPage = () => {
    const { selectChat, action, messageDelivered } = useChat()
    const [chatList, setChatList] = useState([])
    const { dbRef } = useWhisperDB()
    const { openModal, closeModal } = useModal()

    const handleAddNewClick = () => {
        console.log('Add new clicked')
    }

    const loadChats = useCallback(async () => {
        try {
            let allChats = await dbRef.current.getChats()
            setChatList(allChats)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} appearFor={3000} onClose={closeModal} />)
        }
    }, [dbRef, openModal, closeModal])

    useEffect(() => {
        if (dbRef.current) {
            loadChats()
        }
    }, [dbRef, loadChats])

    useEffect(() => {
        if (action || messageDelivered) {
            loadChats()
        }
    }, [action, messageDelivered, loadChats])

    return (
        <div className='chat-page'>
            <div>
                <SearchBar />
            </div>
            <div className='sidebar__stories'>
                <StoriesContainer />
            </div>
            <div className='sidebar__other-content'>
                {chatList && chatList.length > 0 && <ChatList chatList={chatList} chooseChat={selectChat} />}
                <AddNewButton onClick={handleAddNewClick} />
            </div>
        </div>
    )
}

export default ChatPage
