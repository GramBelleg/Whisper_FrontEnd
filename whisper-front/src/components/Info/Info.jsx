import React, { useRef, useState, useEffect } from "react";
import "./Info.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Info = ({ index, group, onMute, onUnMute, muted }) => {

    const infoRef = useRef(null); 
    const dropdownRef = useRef(null); 
    const [dropdownPosition, setDropdownPosition] = useState("down");
    const [isVisible, setIsVisible] = useState(false);
    

    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    const handleAction = (action) => {
        console.log(`${action} clicked`);
        // TODO: Handle the action here (Mute, Pin, Block, Archive, Leave)
    };

    const handlePositioning = () => {
        const infoRect = infoRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current ? dropdownRef.current.offsetHeight : 0;
        const spaceBelow = window.innerHeight - infoRect.bottom;
        const spaceAbove = infoRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
            setDropdownPosition("up"); // Position dropdown above
        } else {
            setDropdownPosition("down"); // Position dropdown below
        }
    };

    useEffect(() => {
        if (isVisible) {
            handlePositioning();
        }
        const handleResize = () => {
            if (isVisible)
                handlePositioning();
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isVisible]);
    

    return (
        <>
        {index && (
            <div className="info" ref={infoRef} onClick={toggleDropdown}>  
                <FontAwesomeIcon icon={faChevronDown} style={{color:"grey"}}/>
            {isVisible && (
                <div
                className="dropdown" // Add a class for dropdown styling
                onMouseLeave={() => {setIsVisible(false)}}
                ref={dropdownRef}
                style={{
                    top: dropdownPosition === "down" ? "100%" : "auto",
                    bottom: dropdownPosition === "up" ? "100%" : "auto",
                }}
                >
                <ul >
                    {
                        !muted ? (
                            <li
                                onClick={() => { onMute(0) }}
                                >
                                    Mute notifications
                            </li>
                        ) : (
                            <li
                                onClick={() => { onUnMute() }}
                                >
                                    Unmute notifications
                            </li>
                        )
                    }
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
