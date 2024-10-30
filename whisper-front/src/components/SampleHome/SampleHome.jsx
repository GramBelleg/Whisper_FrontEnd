// This is just for testing
import { useEffect, useState } from 'react'
import ChatPage from '../ChatPage/ChatPage'
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import "../SampleHome/SampleHome.css"
import ButtonsBar from "../ButtonsBar/ButtonsBar";
import useFetch from "../../services/useFetch";
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import axios from 'axios'
import { getChatsAPI, getChatsCleaned, getUserForChat } from '@/services/chatservice/getChats'
import { getMessagesForChatCleaned, getMessagesForChatFromAPI } from '@/services/chatservice/getMessagesForChat'


const SampleHome = () => {

    const [currentSelectedUser, setCurrentSelectedUser] = useState({});
    const [chatList, setChatList] = useState([]);
    const [errorChats, setErrorChats] = useState(false);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingAllUsers, setLoadingAllUsers] = useState(true);


    useEffect(() => {
        getChatsCleaned().then(allChats => {
            setChatList(allChats);
            setLoadingChats(false);
            console.log(allChats)
        }).catch(error => {
            console.log("Error: ", error.message);
        });

    }, []);


    const chooseChat = (id) => {
        if (!loadingChats) {
            try {
                const currentUser = getUserForChat(id);
                if (currentUser) {
                    console.log(currentUser)
                    setLoadingAllUsers(false);
                    setCurrentSelectedUser(currentUser);
                }
            } catch (error) {
                console.log("Error ", error.message);
            }
        }
    }

    return ( 
        <div className="sampleHome">
            <div className="buttons-bar-container">
                <ButtonsBar />
            </div>
            <div className="chatpage-container">
                {!loadingChats && <ChatPage chatList={chatList} chooseChat={chooseChat}/>}
            </div>
            <div className="chatting">
                {
                    loadingAllUsers ? <NoChatOpened /> : <SingleChatSection selectedUser={currentSelectedUser}/>
                }
            </div>
        </div>
    )
}

export default SampleHome
