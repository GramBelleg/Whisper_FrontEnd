import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PinnedMessages.css";
import { faThumbtack, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useChat } from "@/contexts/ChatContext";

const PinnedMessages = ({ pinnedMessages, onGoToMessage }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { unPinMessage } = useChat();
    const [myPinnedMessages, setMyPinnedMessages] = useState([]);

    const handleNextMessage = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length);
    };

    const handlePreviousMessage = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? pinnedMessages.length - 1 : prevIndex - 1
        );
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleUnpin = () => {
        const updatedMessages = pinnedMessages.filter(
            (_, index) => index !== activeIndex
        );

        setMyPinnedMessages(updatedMessages);
        
        unPinMessage(pinnedMessages[activeIndex].id);

        // Adjust the active index only after the pinnedMessages update
        const newActiveIndex =
            activeIndex >= pinnedMessages.length - 1
                ? pinnedMessages.length - 2
                : activeIndex;

        setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
        setIsDropdownOpen(false);
    };

    const handleGoToMessage = () => {
        if (onGoToMessage) {
            onGoToMessage(pinnedMessages[activeIndex]);
        }
        setIsDropdownOpen(false);
    };

    // Watch for changes in pinnedMessages
    useEffect(() => {
        setMyPinnedMessages(pinnedMessages);
        setActiveIndex(0);
    }, [pinnedMessages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="pinned-messages-container">
            <div className="indicators-container">
                {myPinnedMessages?.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${
                            activeIndex === index ? "indicator-active" : "indicator-inactive"
                        }`}
                    ></div>
                ))}
            </div>

            <div
                className="pinned-messages"
                onClick={handleNextMessage}
                onContextMenu={(e) => {
                    e.preventDefault(); // Prevent default context menu
                    handlePreviousMessage();
                }}
            >
                <FontAwesomeIcon icon={faThumbtack} style={{ height: "24px" }} className="icon-pin" />
                <div className="messages-list">
                    <div className="pinned-message">
                        <p className="message-content" title={myPinnedMessages[activeIndex]?.content}>
                            {myPinnedMessages[activeIndex]?.content}
                        </p>
                    </div>
                </div>

                <div className="dropdown-container" ref={dropdownRef}>
                    <FontAwesomeIcon 
                        icon={faChevronDown}
                        className="dropdown-icon"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleUnpin}>Unpin</button>
                            <button onClick={handleGoToMessage}>Go to Message</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PinnedMessages;
