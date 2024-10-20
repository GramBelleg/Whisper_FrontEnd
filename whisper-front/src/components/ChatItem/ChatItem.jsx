import React, { useMemo, useState, useEffect, useRef } from "react";

// Import Utility Functions
import { checkDisplayTime } from "../../services/chatservice/checkDisplayTime";
import { handleNoUserImage } from "../../services/chatservice/addDefaultImage";
import { mapMessageState } from "../../services/chatservice/mapMessageState";

// Import Components
import noUser from "../../assets/images/no-user.png";
import NotificationBell from "../NotificationBell/NotificationBell";
import ReadTicks from "../ReadTicks/ReadTicks";
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import LastMessage from "../LastMessage/LastMessage";
import UnRead from "../UnRead/UnRead";
import Info from "../Info/Info";

import "./ChatItem.css";
import { whoAmI } from "../../services/chatservice/whoAmI";
import PendingSend from "../PendingSend/PendingSend";


const ChatItem = ({ index, standaloneChat, chooseChat }) => {

    const maxLength = (
        
        (standaloneChat.muted) ? 33 : 
        (standaloneChat.sender === whoAmI.name) ? 30 : 15
    )
    
    // Use memo helps validate the chat  on every render

    // Track overflow of text
    const [isOverflowing, setIsOverflowing] = useState(false); 

    // Create a ref for the user name
    const userNameRef = useRef(null);
    
    const trimName = (name) => {
        return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
    }

    // The local obhect of the chat
    const [myChat, setMyChat] = useState({
        id: -1,
        senderId: -1,
        sender:'',
        type: "",
        unreadMessageCount: 0,
        lastMessageId: -1,
        lastMessage:"",
        name:"",
        lastSeen: "",
        muted: false,
        messageState:"",
        messageTime:"",
        messageType:"",
        tagged: false,
        group: false,
        story: false,
        profilePic:''
    });

    // Function to handle clicks and call chooseChat
    const handleClick = (e) => {
        // Check if the click is on the Info component
        const infoElement = e.target.closest('.info'); // Assuming .info-component is the class for the Info component
        if (!infoElement) {
            chooseChat(myChat.id); // Call chooseChat if not clicking on Info
        }
    };

    // Use Effect that renders on change in the coming object
    useEffect(() => {
        // Update chat state from standaloneChat
        setMyChat((prevChat) => ({
            ...prevChat,
            ...standaloneChat,
            messageState: mapMessageState(standaloneChat.messageState),
            messageTime: checkDisplayTime(standaloneChat.messageTime),
            name: trimName(standaloneChat.name)
        }));
        console.log(standaloneChat.profilePic)

        // Check for overflow when the name changes
        const checkOverflow = () => {
            if (userNameRef.current) {
                const { scrollWidth, clientWidth } = userNameRef.current;
                setIsOverflowing(scrollWidth > clientWidth); // Update overflow state
            }
        };
        console.log("chat ", myChat);

        checkOverflow(); // Initial check
        window.addEventListener("resize", checkOverflow); // Check on resize

        return () => {
            window.removeEventListener("resize", checkOverflow); // Cleanup
        };
    }, [standaloneChat, myChat.name]); // Dependencies

    return ( 
        <div className="single-chat" onClick={handleClick}>
            {(
                <div className="single-chat-content">
                    <div className={`profile-pic-wrapper ${myChat.story ? 'has-story' : ''}`}>
                        <img 
                            src={myChat.profilePic || noUser}
                            className={`profile-pic`} // Add the conditional class
                            onError={(e) => handleNoUserImage(e)}
                        />
                    </div>

                    <div className="content">
                        <div className="user-info">
                            <div className="name-container">
                                <p 
                                    ref={userNameRef} // Attach the ref to the user name element
                                    className={`user-name ${myChat.muted ? 'muted' : ''} ${isOverflowing ? 'overflow' : ''} ${index ? 'hovered' : ''}`} // Add overflow class conditionally
                                >
                                    {myChat.name}
                                </p>
                                {myChat.muted && (
                                    <div className="muted-bell">
                                        <NotificationBell />
                                    </div>
                                )}
                            </div>
                            <div className="ticks-info">
                                <div className="tick">
                                {
                                        myChat.messageState === 0  && (
                                            <SentTicks/>
                                        ) 
                                        || 
                                        myChat.messageState ==  1 && (
                                            <DeliveredTicks/>
                                        )
                                        || 
                                        myChat.messageState ==  2 && (
                                            <ReadTicks/>
                                        )
                                        || 
                                        myChat.messageState ==  4 && (
                                            <PendingSend/>
                                        )
                                        
                                    } 
                                </div>
                                <div className="message-time">
                                    <span className={myChat.unreadMessageCount ? 'unread-time' : ''}>
                                        {myChat.messageTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="messaging-info">
                            <LastMessage sender={myChat.sender} messageType={myChat.messageType} message={myChat.lastMessage} index={index} messageState={myChat.messageState}/>
                            { (myChat.unreadMessageCount || myChat.tagged) && <UnRead unReadMessages={myChat.unreadMessageCount} tag={myChat.tagged}/>}
                            <Info index={index} group={myChat.group}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatItem;