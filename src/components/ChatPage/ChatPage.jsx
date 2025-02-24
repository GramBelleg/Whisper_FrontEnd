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
import EditableField from '../ProfileSettings/EditFields/EditableField'
import AddContactModal from '../AddContactModal/AddContactModal'

const ChatPage = () => {
    const { selectChat, chatAltered, reloadChats, SetReloadChats, addNewContactByUser } = useChat()
    const [chatList, setChatList] = useState([])
    
    const { dbRef } = useWhisperDB()
    const { openModal, closeModal } = useModal()
    const [dropDownVisible, setDropDownVisible] = useState(false)
    const { setActivePage, setType } = useSidebar()
    
    const handleCreatePrivateClick = () => {
        setDropDownVisible(false)
        openModal(
            <CreatePrivateChatModal />
        )
    }

    const handleCreateGroupClick = () => {
        setDropDownVisible(false)
        setType("GROUP")
        setActivePage("create_group")
    }

    const handleCreateChannelClick = () => {
        setDropDownVisible(false)
        setType("CHANNEL")
        setActivePage("create_group")
    }

    const handleAddNewContact = () => {
        setDropDownVisible(false)
        
        openModal(
            <AddContactModal
                onAddUser={addNewContactByUser}
                onClose={closeModal}
            />
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
        if (chatAltered) {
            loadChats()
        }
    }, [reloadChats, chatAltered, loadChats])

    return (
        <div className='chat-page'>
            <div className='outer-search-bar'
               onClick={() => setActivePage('search')} 
                style={{
                    height: "50px",
                    width: "95%"
                }}
            >
                <SearchBar />
            </div>
            <div className='sidebar__stories'>
                <StoriesContainer />
            </div>
            <div className='sidebar__other-content overflow-y-auto h-full'>
                {chatList && chatList.length > 0 && <ChatList chatList={chatList} />}
                {!dropDownVisible ? <AddNewButton onClick={() => setDropDownVisible(true)} /> : (
                    <div className="create-new">
                        <CreateNewChat 
                            myOnMouseLeave={() => setDropDownVisible(false)}
                            handleCreatePrivateClick={handleCreatePrivateClick}
                            handleCreateGroupClick={handleCreateGroupClick}
                            handleCreateChannelClick={handleCreateChannelClick}
                            handleAddNewContact={handleAddNewContact}
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
