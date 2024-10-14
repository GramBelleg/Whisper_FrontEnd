// This page Contains Stories and the chats
// It renders both stories page and chats page

import useFetch from "../../services/useFetch";
import AudioVoiceNoteMessage from "../AudioVoiceNoteMessage/AudioVoiceNoteMessage";
import ChatList from "../ChatList/ChatList";
import "../ChatPage/ChatPage.css";

const ChatPage = () => {

    const {data: chatList, error, loading} = useFetch('/chats');

    return ( 
        <div className="chat-page">
            <div className="stories-container">
                <h1>Stories</h1>
            </div>
            <div className="chat-list-container">
                {chatList && <ChatList chatList={chatList}/> }
            </div>
        </div>
    );
}
 
export default ChatPage;