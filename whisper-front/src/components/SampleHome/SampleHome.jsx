import { useState } from 'react'
import ChatPage from '../ChatPage/ChatPage'
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import "../SampleHome/SampleHome.css"
import ButtonsBar from "../ButtonsBar/ButtonsBar";
import useFetch from "../../services/useFetch";
import NoChatOpened from '../NoChatOpened/NoChatOpened'
import { ModalProvider } from '../../contexts/ModalContext'


const SampleHome = () => {

    const [currentSelectedChat, setCurrentSelectedChat] = useState({});
    const [currentSelectedUser, setCurrentSelectedUser] = useState({});
    const {data: chatList, error: errorChats, loading: loadingChats} = useFetch('/chats');
    const {data:allUserDetailsFromBack, loading:loadingAllUsers, error: errorAllUser} = useFetch('/userDetails');

    const chooseChat = (id) => {
        if (!loadingChats) {
            console.log(id)
            const currentChat = chatList.filter(
                (chat) => chat.id === id
            )[0];
            
            if (currentChat) {
                const currentUser = allUserDetailsFromBack.filter(
                    (user) => user.userId === currentChat.othersId
                )[0];
                console.log("chat ",currentChat)
                console.log("user ",currentUser)
                if (currentUser) {
                    
                    // Add profile picture to currentChat
                    currentChat.sender = currentUser.name;

                    console.log("chat ",currentChat)
                    console.log("user ",currentUser)
                    // Set the updated currentChat and currentUser
                    setCurrentSelectedChat(currentChat);
                    setCurrentSelectedUser(currentUser);
                }
            }
        }
        
    }


    return ( 
        <ModalProvider>
        <div className="sampleHome">
            <div className="buttons-bar-container">
                <ButtonsBar />
            </div>
            <div className="chatpage-container">
                {!loadingChats && <ChatPage chatList={chatList} chooseChat={chooseChat}/>}
            </div>
            <div className="chatting">
                {
                    Object.keys(currentSelectedChat).length === 0 ?
                    <NoChatOpened /> :
                    !loadingAllUsers && <SingleChatSection selectedUser={currentSelectedUser}/>
                }
            </div>
        </div>
        </ModalProvider>
    )
}

export default SampleHome
