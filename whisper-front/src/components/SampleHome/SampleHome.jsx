// This is just for testing
import { useState } from 'react'
import ChatPage from '../ChatPage/ChatPage'
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import "../SampleHome/SampleHome.css"
import ButtonsBar from "../ButtonsBar/ButtonsBar";

const SampleHome = () => {
    const [selectedUser, setSelectedUser] = useState({
        id: 1,
        name: 'John Doe'
    })

    return ( 
        <div className="sampleHome">
            <div className="buttons-bar-container">
                <ButtonsBar />
            </div>
            <div className="chatpage-container">
                <ChatPage/>
            </div>
            <div className="chatting">
                <SingleChatSection selectedUser={selectedUser} />
            </div>
        </div>
    )
}

export default SampleHome
