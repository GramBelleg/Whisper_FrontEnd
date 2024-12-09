import ChatList from '../ChatList/ChatList'
import './ChatPage.css'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SearchBar from '../SearchBar/SearchBar'
import { useState, useEffect } from 'react'
import AddNewButton from '../AddNewButton/AddNewButton'
import { useChat } from '@/contexts/ChatContext'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import CreatePrivateChatModal from '../Modals/CreatePrivateChatModal/CreatePrivateChatModal'
import CreateNewChat from '../CreateNewChat/CreateNewChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSidebar } from '@/contexts/SidebarContext'

const ChatPage = () => {
    const { selectChat, action, messageDelivered, reloadChats, SetReloadChats } = useChat()
    const [chatList, setChatList] = useState([])
    const { dbRef } = useWhisperDB()
    const { openModal, closeModal } = useModal()
    const [dropDownVisible, setDropDownVisible] = useState(false)
    const { setActivePage } = useSidebar()
    
    const handleCreatePrivateClick = () => {
        setDropDownVisible(false)
        openModal(
            <CreatePrivateChatModal />
        )
    }

    const handleCreateGroupClick = () => {
        setDropDownVisible(false)
        setActivePage("create_group")
    }

    const handleCreateChannelClick = () => {
        setDropDownVisible(false)
        openModal(
            <CreatePrivateChatModal />
        )
    }

    const loadChats = async () => {
        try {
            let allChats = await dbRef.current.getChats()
            setChatList(allChats)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} appearFor={3000} onClose={closeModal} />)
        }
    }

    useEffect(() => {
        loadChats()
    }, []);

    useEffect(() => {
        if (reloadChats) {
            loadChats()
            SetReloadChats(false)
        }
        if (action || messageDelivered) {
            loadChats()
        }
    }, [reloadChats, action, messageDelivered, loadChats])

    return (
        <div className='chat-page'>
            <div>
                <SearchBar />
            </div>
            <div className='sidebar__stories'>
                <StoriesContainer />
            </div>
            <div className='sidebar__other-content overflow-y-auto h-full'>
                {chatList && chatList.length > 0 && <ChatList chatList={chatList} chooseChat={selectChat} />}
                {!dropDownVisible ? <AddNewButton onClick={() => setDropDownVisible(true)} /> : (
                    <div className="create-new">
                        <CreateNewChat 
                            myOnMouseLeave={() => setDropDownVisible(false)}
                            handleCreatePrivateClick={handleCreatePrivateClick}
                            handleCreateGroupClick={handleCreateGroupClick}
                            handleCreateChannelClick={handleCreateChannelClick}
                        />
                        <div className="close-create" onClick={() => setDropDownVisible(false)}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage
