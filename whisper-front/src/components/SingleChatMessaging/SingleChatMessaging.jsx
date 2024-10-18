

import { useEffect, useMemo, useRef, useState } from "react";
import "./SingleChatMessaging.css" 
import { messageTypes } from "../../services/sendTypeEnum";
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker';


const SingleChatMessaging = ({ updateIconSend, sendMessage }) => {

    const [currentMessage, setCurrentMessage] = useState('');
    const textareaRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevents new line from being added
            mySendMessage();
        }

    }

    const handleEmojiClick = (emojiObject) => {
        setCurrentMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    const mySendMessage = () => {
        
        if (currentMessage.trim()) {
            console.log("Message sent:", currentMessage);
            setCurrentMessage('');  // Clear message input after sending
            updateIconSend(false);  // Reset typing icon state
            textareaRef.current.style.height = 'auto'; // Reset height to auto first
            sendMessage(messageTypes.TEXT,  currentMessage);
        }
    }

    useEffect(() => {
        if(currentMessage.length > 0) {
            updateIconSend(true);
        }
        else {
            updateIconSend(false);
        }
    }, [currentMessage])


    const updateNewMessage = (event) => {
        const value = event.target.value;
        event.target.style.height = 'auto'; // Reset height
        event.target.style.height = `${event.target.scrollHeight}px`; 

        if (event.target.scrollHeight <= 200) {
            setCurrentMessage(value);
        } else {
            // If it exceeds, prevent further input
            event.target.value = currentMessage; // Reset to previous message
        }
    }

    return ( 
        <>
            <div className='emojis-container'>
                <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
            </div>
            <textarea
                type='text'
                ref={textareaRef}
                value={currentMessage}
                onInput={updateNewMessage}
                onKeyDown={handleKeyPress}
                className='message-input'
                placeholder='Message Here'
                rows={1} 
            />
        </>
    );
}
 
export default SingleChatMessaging;