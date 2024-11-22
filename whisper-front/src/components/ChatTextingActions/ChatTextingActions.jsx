import { useEffect, useRef } from "react";
import "./ChatTextingActions.css";
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker';

const ChatTextingActions = ({ textMessage, setTextMessage, triggerSendMessage }) => {
    const textareaRef = useRef(null);
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents new line from being added
            triggerSendMessage();
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setTextMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    useEffect(() => {
        if (textMessage.length === 0) {
            textareaRef.current.style.height = 'auto';
        }
    }, [textMessage]);

    const updateNewMessage = (event) => {
        textareaRef.current.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;

        if (event.target.scrollHeight <= 200) {
            const value = event.target.value;
            setTextMessage(value);
        }
    };

    return (
        <>
            <div className='emojis-container'>
                <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
            </div>
            <textarea
                type='text'
                ref={textareaRef}
                value={textMessage}
                onInput={updateNewMessage}
                onKeyDown={handleKeyPress}
                className='message-input'
                placeholder='Message Here'
                rows={1}
            />
        </>
    );
};

export default ChatTextingActions;
