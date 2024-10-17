

import { useEffect, useMemo, useRef, useState } from "react";
import "./SingleChatMessaging.css" 

const SingleChatMessaging = ({ updateIconSend }) => {

    const [currentMessage, setCurrentMessage] = useState('');
    const textareaRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevents new line from being added
            sendMessage();
        }

    }

    const sendMessage = () => {
        
        if (currentMessage.trim()) {
            console.log("Message sent:", currentMessage);
            setCurrentMessage('');  // Clear message input after sending
            updateIconSend(false);  // Reset typing icon state
            textareaRef.current.style.height = 'auto'; // Reset height to auto first
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
        <textarea
            type='text'
            ref={textareaRef}
            value={currentMessage}
            onInput={updateNewMessage}
            onKeyDown={handleKeyPress}
            className='message-input'
            placeholder='Message Here'
            rows={1} // Set to 1 to ensure it's minimized when empty
        />
    );
}
 
export default SingleChatMessaging;