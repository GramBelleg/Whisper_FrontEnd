import React from "react";
import './ButtonsBar.css';
import Bookmark from '../../assets/images/bookmark.svg?react';
import Chat from '../../assets/images/chat.svg?react';
import Settings from '../../assets/images/settings.svg?react';
import Starred from '../../assets/images/starred.svg?react';
import Stories from '../../assets/images/stories.svg?react';
import LogOut from "../../assets/images/logout.svg?react";
import useAuth from "@/hooks/useAuth";

const ButtonsBar = () => {
    const {handleLogout} = useAuth();
    const handleClick = (iconName) => {
        console.log(`${iconName} clicked`);
    };

    const handleloggingout = async () =>{
        try {
            await handleLogout();
        } catch (error) {
            console.error("Error logging out:", error.message || error);
        }
    }

    return (
        <div className="icon-column">
            <div onClick={() => handleClick('Chat')} className="icon-container">
                <Chat className="icon" />
            </div>
            <div onClick={() => handleClick('Bookmark')} className="icon-container">
                <Bookmark className="icon" />
            </div>
            <div onClick={() => handleClick('Starred')} className="icon-container">
                <Starred className="icon" />
            </div>
            <div onClick={() => handleClick('Stories')} className="icon-container">
                <Stories className="icon" />
            </div>
            <div onClick={() => handleloggingout()} className="icon-container logout-icon">
                <LogOut className="icon" />
            </div>
            <div onClick={() => handleClick('Settings')} className="icon-container settings-icon">
                <Settings className="icon" />
            </div>
        </div>
    );
};

export default ButtonsBar;
