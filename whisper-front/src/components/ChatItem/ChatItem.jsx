import { useState, useEffect, useRef } from "react";
import { checkDisplayTime } from "../../services/chatservice/checkDisplayTime";
import { handleNoUserImage } from "../../services/chatservice/addDefaultImage";
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
import { useChat } from "@/contexts/ChatContext";


const ChatItem = ({ index, standaloneChat }) => {

    const maxLength = (
        
        (standaloneChat.muted) ? 33 : 
        (standaloneChat.name === whoAmI.name) ? 30 : 15
    )
    
    // Track overflow of text
    const [isOverflowing, setIsOverflowing] = useState(false); 

    // Create a ref for the user name
    const userNameRef = useRef(null);
    
    const trimName = (name) => {
        if(name) 
            return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
        return ''
    }

    // The local obhect of the chat
    const [myChat, setMyChat] = useState({
        id: -1,
        senderId: -1,
        type: "",
        unreadMessageCount: 0,
        lastMessageId: -1,
        lastMessage:"",
        name:"",
        lastSeen: "",
        muted: false,
        media: false,
        messageState:-1,
        messageTime:"",
        messageType:"",
        tagged: false,
        group: false,
        story: false,
        othersId: -1,
        profilePic: '',
    });

    const { selectChat } = useChat();

    // Function to handle clicks and call chooseChat
    const handleClick = (e) => {
        // Check if the click is on the Info component
        const infoElement = e.target.closest('.info'); // Assuming .info-component is the class for the Info component
        if (!infoElement) {

            selectChat(myChat);
        }
    };

    // Use Effect that renders on change in the coming object
    useEffect(() => {
        // Update chat state from standaloneChat
        setMyChat((prevChat) => ({
            ...prevChat,
            ...standaloneChat,
            messageTime: checkDisplayTime(standaloneChat.messageTime),
            name: trimName(standaloneChat.name)
        }));

        console.log(standaloneChat)
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
    }, [standaloneChat]); // Dependencies

    return ( 
        <div data-testid="chat-item" className="single-chat" onClick={handleClick}>
            {(
                <div className="single-chat-content">
                    <div className={`profile-pic-wrapper ${myChat.story ? 'has-story' : ''}`}>
                        <img 
                            src={myChat.profilePic}
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
                                        myChat.messageState === 0  && <SentTicks data-testid="sent-tick"/> || 
                                        myChat.messageState ==  1 && <DeliveredTicks data-testid="delivered-tick"/> || 
                                        myChat.messageState ==  2 && <ReadTicks data-testid="read-tick"/> || 
                                        myChat.messageState ==  4 && <PendingSend data-testid="pending-tick"/>  
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
                            {myChat.lastMessage && <LastMessage sender={myChat.senderId} messageType={myChat.messageType} message={myChat.lastMessage} index={index} messageState={myChat.messageState}/>}
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