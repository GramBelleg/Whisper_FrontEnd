// This page Contains Stories and the chats
// It renders both stories page and chats page

import useFetch from "../../services/useFetch";
import ChatList from "../ChatList/ChatList";
import "./ChatPage.css";
import StoriesContainer from "../StoriesContainer/StoriesContainer";
import SearchBar from "../SearchBar/SearchBar";
import React, { useState, useEffect, useRef } from 'react';
import AddNewButton from "../AddNewButton/AddNewButton";

const ChatPage = ({ chatList, chooseChat }) => {

    
    const [sidebarWidth, setSidebarWidth] = useState(100); 
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);

    const startResizing = (e) => {
        isResizing.current = true;
    };

    const stopResizing = () => {
        isResizing.current = false;
    };

    const resize = (e) => {
        if (isResizing.current) {
            const newWidth = (e.clientX / window.innerWidth) * 100; 
            if (newWidth >= 20 && newWidth <= 45) {
                setSidebarWidth(newWidth);
            }
        }
    };

    const handleAddNewClick = () => {
        console.log('Add new clicked');
    };


    useEffect(() => {
        const handleMouseUp = stopResizing;
        const handleMouseMove = resize;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    return ( 
        // <div className="chat-page">
            <div
            className="sidebar"
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}%` }}
        >
            <div>
                { true && <SearchBar />}
            </div>
            <div className="sidebar__stories">
                { true && <StoriesContainer /> }
            </div>
            <div className="sidebar__other-content">
                {chatList &&  <ChatList chatList={chatList} chooseChat={chooseChat}/>}
                <AddNewButton onClick={handleAddNewClick} />
            </div>
            <div
                className="sidebar__resizer"
                onMouseDown={startResizing}
            />
        </div>
    )
}

export default ChatPage
