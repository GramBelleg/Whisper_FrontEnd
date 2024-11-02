import React from "react";
import './ButtonsBar.css';
import Bookmark from '../../assets/images/bookmark.svg?react';
import Chat from '../../assets/images/chat.svg?react';
import Settings from '../../assets/images/settings.svg?react';
import Starred from '../../assets/images/starred.svg?react';
import Stories from '../../assets/images/stories.svg?react';
import LogoutButton from "../auth/Logout/LogoutButton";
import ProfilePic from "../ProfileSettings/ProfilePicture/ProfilePic";
import { useSidebar } from "@/contexts/SidebarContext";

const ButtonsBar = () => {
    const handleClick = (iconName) => {
        console.log(`${iconName} clicked`);
    };
    const { setActivePage }= useSidebar();
    const toggleProfileSettings = () => {
        console.log('toggleProfileSettings');
        setActivePage('profileSettings');
    };


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
            <LogoutButton />
            <div className="profile-pic-container">
                <ProfilePic handleClick={toggleProfileSettings} />
            </div>
            <div onClick={() => handleClick('Settings')} className="icon-container settings-icon">
                <Settings data-testid="settings-icon" className="icon" />
            </div>
        </div>
    );
};

export default ButtonsBar;
