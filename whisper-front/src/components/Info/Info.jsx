// This Shows the Icon of dropdown menu
// You can then mute chats

import React, { useState } from "react";
import "./Info.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";



const Info = ({ index, group }) => {

    // This  is the state for the dropdown menu
    const [isVisible, setIsVisible] = useState(false);

    // This controls the visibity of the drop down
    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    // This will be one for every action
    const handleAction = (action) => {
        console.log(`${action} clicked`);
        // Handle the action here (Mute, Pin, Block, Archive, Leave)
    };
    

    return (
        <>
        {index && (
            <div className="info" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faChevronDown} />
            {isVisible && (
                <div
                className="dropdown" // Add a class for dropdown styling
                onMouseLeave={() => {setIsVisible(false)}}
                >
                <ul >
                    <li
                    onClick={() => handleAction('Mute notifications')}
                    >
                    Mute notifications
                    </li>
                    <li
                    onClick={() => handleAction('Block')}
                    >
                    Block
                    </li>
                    <li
                    onClick={() => handleAction('Archive')}
                    >
                    Archive
                    </li>
                    {group && (
                    <li
                        style={{ padding: "8px 12px", cursor: "pointer", color: "red" }}
                        onClick={() => handleAction('Leave group')}
                    >
                        Leave group
                    </li>
                    )}
                </ul>
                </div>
            )}
            </div>
        )}
        </>
    );
};

export default Info;
