// This is just for testing
import { useState } from "react";
import ChatPage from "../ChatPage/ChatPage";
import "../SampleHome/SampleHome.css"
import SingleChatSection from "../SingleChatSection/SingleChatSection";


const SampleHome = () => {

    const [selectedUser, setSelectedUser] = useState({
        id: 1,
        name: "John Doe",
    });

    return ( 
        <div className="sampleHome">
            <div className="side-bar-container">
                Hello
            </div>
            <div className="chat-page-container">
                <ChatPage changeSelectedUser={setSelectedUser}/>
            </div>
            <div className="chatting">
                <SingleChatSection selectedUser={selectedUser}/>
            </div>
        </div>
    );
}
 
export default SampleHome;