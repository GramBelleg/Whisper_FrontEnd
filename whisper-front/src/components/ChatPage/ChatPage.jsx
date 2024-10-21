// This page Contains Stories and the chats
// It renders both stories page and chats page

import useFetch from "../../services/useFetch";
import ChatList from "../ChatList/ChatList";
import "./ChatPage.css";
import StoriesContainer from "../StoriesContainer/StoriesContainer";
import SearchBar from "../SearchBar/SearchBar";
import React, { useState, useEffect, useRef } from 'react';

const ChatPage = () => {

    const {data: chatList, error, loading} = useFetch('/chats');
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
                {chatList &&  <ChatList chatList={chatList}/>}
            </div>
            <div
                className="sidebar__resizer"
                onMouseDown={startResizing}
            />
        {/* </div> */}
            {/* <div className="stories-container">
                <h1>Stories</h1>
            </div>
            <div className="chat-list-container">
                {chatList &&  <ChatList chatList={chatList}/>}
            </div> */}
        </div>
    )
}

export default ChatPage
