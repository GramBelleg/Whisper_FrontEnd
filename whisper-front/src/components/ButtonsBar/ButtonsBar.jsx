import React from "react";
import './ButtonsBar.css';
import Bookmark from '../../assets/images/bookmark.svg?react';
import Chat from '../../assets/images/chat.svg?react';
import Settings from '../../assets/images/settings.svg?react';
import Starred from '../../assets/images/starred.svg?react';
import Stories from '../../assets/images/stories.svg?react';
import LogoutButton from "../auth/Logout/LogoutButton";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { faArrowLeft } from  '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonsBar = () => {
    const handleClick = (iconName) => {
        console.log(`${iconName} clicked`);
    };
    const { setActivePage } =  useSidebar();

    return (
        <div className="icon-column">
            <div onClick={() => handleClick('Chat')} className="icon-container">
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
            <div onClick ={() => setActivePage('visibility')} className="icon-container">
                <FontAwesomeIcon  icon={faArrowLeft} />
            </div>
            <LogoutButton />
            <div onClick={() => handleClick('Settings')} className="icon-container settings-icon">
                <Settings data-testid="settings-icon" className="icon" />
            </div>
        </div>

    );
};

export default ButtonsBar;
