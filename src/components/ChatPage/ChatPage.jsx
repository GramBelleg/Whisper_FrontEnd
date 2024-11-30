import ChatList from "../ChatList/ChatList";
import "./ChatPage.css";
import StoriesContainer from "../StoriesContainer/StoriesContainer";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from 'react';
import AddNewButton from "../AddNewButton/AddNewButton";
import { useChat } from "@/contexts/ChatContext";
import { useWhisperDB } from "@/contexts/WhisperDBContext";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";

const ChatPage = () => {
    const { messageReceived, messages, selectChat } = useChat();
    const [chatList, setChatList] = useState([]);
    const { db } = useWhisperDB();
    const { openModal, closeModal } = useModal();
    const [action, setAction] = useState(null);

    const handleAddNewClick = () => {
        console.log('Add new clicked');
    };

    const loadChats = async () => {
        try {
            let allChats = await db.getChats();
            setChatList(allChats);
        } catch (error) {
            openModal(
                <ErrorMesssage
                  errorMessage={error.message}
                  appearFor={3000}
                  onClose={closeModal}
                />
            )
        }
    }

    useEffect(() => {
        if (db) {
            loadChats();
        }
    }, [db]);

    useEffect(() => {
        if (action) {
            loadChats();
            setAction(false);
        }
    }, [action]);

    useEffect(() => { loadChats() }, [messages, messageReceived]);
    
    return (
        <div className="chat-page">
            <div>
                <SearchBar />
            </div>
            <div className="sidebar__stories">
                <StoriesContainer />
            </div>
            <div className="sidebar__other-content">
                {chatList && chatList.length > 0 &&  <ChatList chatList={chatList} chooseChat={selectChat} setAction={setAction}/>}
                <AddNewButton onClick={handleAddNewClick} />
            </div>
        </div>
    )
}

export default ChatPage
