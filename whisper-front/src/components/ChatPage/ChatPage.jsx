import ChatList from "../ChatList/ChatList";
import "./ChatPage.css";
import StoriesContainer from "../StoriesContainer/StoriesContainer";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from 'react';
import AddNewButton from "../AddNewButton/AddNewButton";
import { useChat } from "@/contexts/ChatContext";
import { getChatsCleaned } from "@/services/chatservice/getChats";

const ChatPage = () => {

    const { selectChat } = useChat();
    const [chatList, setChatList] = useState([])

    const handleAddNewClick = () => {
        console.log('Add new clicked');
    };


    const loadChats = async () => {
        let allChats = await getChatsCleaned();
        setChatList(allChats)
        console.log(allChats)
    }


    useEffect(() => {
        loadChats()
    }, []);
    
    return (
        <div className="chat-page">
            <div>
                <SearchBar />
            </div>
            <div className="sidebar__stories">
                <StoriesContainer />
            </div>
            <div className="sidebar__other-content">
                {chatList &&  <ChatList chatList={chatList} chooseChat={selectChat}/>}
                <AddNewButton onClick={handleAddNewClick} />
            </div>
        </div>
    )
}

export default ChatPage
