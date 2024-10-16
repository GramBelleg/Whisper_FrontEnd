import React, { useMemo, useState, useEffect, useRef } from "react";

// Import Utility Functions
import { isValidChat } from "../../services/chatservice/isValidChat";
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
import { whoAmI } from "../../services/chatservice/chatParams";


const ChatItem = ({ index, standaloneChat }) => {

    const maxLength = (
        
        (standaloneChat.muted) ? 33 : 
        (standaloneChat.sender === whoAmI) ? 30 : 15
    )
    
    // Use memo helps validate the chat  on every render
    const isValid = useMemo(() => isValidChat(standaloneChat), [standaloneChat]);

    // Track overflow of text
    const [isOverflowing, setIsOverflowing] = useState(false); 

    // Create a ref for the user name
    const userNameRef = useRef(null);
    
    const trimName = (name) => {
        return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
    }

    // The local obhect of the chat
    const [myChat, setMyChat] = useState({
        name: "",
        profile_pic: "",
        message: "",
        message_state: 1,
        muted: true,
        last_seen: "",
        unread_notifications: 3,
        message_time:"",
        message_type:"",
        tagged: false,
        sender:"",
        group:false
    });

    // Use Effect that renders on change in the coming object
    useEffect(() => {
        // Update chat state from standaloneChat
        setMyChat((prevChat) => ({
            ...prevChat,
            ...standaloneChat,
            message_state: mapMessageState(standaloneChat.message_state),
            display_time: checkDisplayTime(standaloneChat.message_time),
            name: trimName(standaloneChat.name)
        }));

        // Check for overflow when the name changes
        const checkOverflow = () => {
            if (userNameRef.current) {
                const { scrollWidth, clientWidth } = userNameRef.current;
                setIsOverflowing(scrollWidth > clientWidth); // Update overflow state
            }
        };

        checkOverflow(); // Initial check
        window.addEventListener("resize", checkOverflow); // Check on resize

        return () => {
            window.removeEventListener("resize", checkOverflow); // Cleanup
        };
    }, [standaloneChat, myChat.name]); // Dependencies

    return ( 
        <div className="single-chat">
            {isValid && (
                <div className="single-chat-content">
                    <div className={`profile-pic-wrapper ${myChat.story ? 'has-story' : ''}`}>
                        <img 
                            src={myChat.profile_pic || noUser}
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
                                        myChat.message_state === 0  && (
                                            <SentTicks/>
                                        ) 
                                        || 
                                        myChat.message_state ==  1 && (
                                            <DeliveredTicks/>
                                        )
                                        || 
                                        myChat.message_state ==  2 && (
                                            <ReadTicks/>
                                        )
                                        
                                    } 
                                </div>
                                <div className="message-time">
                                    <span className={myChat.unread_notifications ? 'unread-time' : ''}>
                                        {myChat.display_time}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="messaging-info">
                            <LastMessage sender={myChat.sender} messageType={myChat.message_type} message={myChat.message} index={index} messageState={myChat.message_state}/>
                            { (myChat.unread_notifications || myChat.tagged) && <UnRead unReadMessages={myChat.unread_notifications} tag={myChat.tagged}/>}
                            <Info index={index} group={myChat.group}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatItem;