import React, { useMemo, useState, useEffect, useRef } from "react";
import { isValidChat } from "../../services/chatservice/isValidChat";
import "./ChatItem.css";
import noUser from "../../assets/images/no-user.png";
import { handleNoUserImage } from "../../services/chatservice/addDefaultImage";
import NotificationBell from "../NotificationBell/NotificationBell";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import ReadTicks from "../ReadTicks/ReadTicks";
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import { checkDisplayTime } from "../../services/chatservice/checkDisplayTime";
import LastMessage from "../LastMessage/LastMessage";


const ChatItem = ({ index, standaloneChat }) => {
    

    const isValid = useMemo(() => isValidChat(standaloneChat), [standaloneChat]);
    

    const [myChat, setMyChat] = useState({
        name: "",
        profile_pic: "",
        message: "",
        message_state: 1,
        muted: true,
        last_seen: "",
        unread_notifications: 3,
        message_time:"",
        message_type:""
    });

    console.log("Chat Item", myChat);
    const userNameRef = useRef(null); // Create a ref for the user name
    const [isOverflowing, setIsOverflowing] = useState(false); // State to track overflow


    useEffect(() => {
        // Update chat state from standaloneChat
        setMyChat((prevChat) => ({
            ...prevChat,
            ...standaloneChat,
            message_state: mapMessageState(standaloneChat.message_state),
            display_time: checkDisplayTime(standaloneChat.message_time)
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
                    <img 
                        src={myChat.profile_pic || noUser}
                        className="profile-pic"
                        onError={(e) => handleNoUserImage(e)} // Correct capitalization
                    />
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
                                            <SentTicks width="12px"/>
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
                                    {myChat.display_time}
                                </div>
                            
                            </div>
                        </div>
                        <div className="messaging-info">
                            <LastMessage messageType={myChat.message_type} message={myChat.message} index={index} messageState={myChat.message_state}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatItem;
