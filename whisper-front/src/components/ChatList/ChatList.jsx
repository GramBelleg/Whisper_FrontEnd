// This contains the list of all chats
// It takes as an input the list of all chats
// It then calls the SingleChat page for each chat

import { useState } from "react";
import ChatItem from "../ChatItem/ChatItem";
import "./ChatList.css"

const ChatList = ({ chatList }) => {

    const [hoveredIndex, setHoveredIndex] = useState(null); // Track hovered index

    return ( 
        <div className="chat-list">
            {
                chatList?.map((element, index) => {
                    return (
                        <div key={index} className="chat-item-container"
                            onMouseEnter={() => {setHoveredIndex(index)}}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <ChatItem index={index === hoveredIndex} standaloneChat={element}/>
                        </div>
                    );  
                    
                })
            }
           
        </div>
    )
}

export default ChatList
