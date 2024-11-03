import React from "react";
import './ButtonsBar.css';
import Bookmark from '../../assets/images/bookmark.svg?react';
import Chat from '../../assets/images/chat.svg?react';
import Settings from '../../assets/images/settings.svg?react';
import Starred from '../../assets/images/starred.svg?react';
import Stories from '../../assets/images/stories.svg?react';
import LogoutButton from "../auth/Logout/LogoutButton";
import { useSidebar } from "@/contexts/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

const ButtonsBar = () => {
    const handleClick = (iconName) => {
        console.log(`${iconName} clicked`);
    };

    const { setActivePage } = useSidebar();


    return (
        <div className="icon-column">
            <div onClick={() => setActivePage('chat')} className="icon-container">
                <Chat data-testid="chat-icon" className="icon" />
            </div>
            <div onClick={() => handleClick('Bookmark')} className="icon-container">
                <Bookmark data-testid="bookmark-icon" className="icon" />
            </div>
            <div onClick={() => handleClick('Starred')} className="icon-container">
                <Starred data-testid="starred-icon" className="icon" />
            </div>
            <div onClick={() => handleClick('Stories')} className="icon-container">
                <Stories data-testid="stories-icon" className="icon" />
            </div>

            <div onClick={() => setActivePage('blocked_users')} className="icon-container justify-self-end">
                <FontAwesomeIcon height={24} icon={faBan} className="icon" />
            </div>
            <LogoutButton />
            <div onClick={() => handleClick('Settings')} className="icon-container settings-icon">
                <Settings data-testid="settings-icon" className="icon" />
            </div>
        </div>
    );
};

export default ButtonsBar;
