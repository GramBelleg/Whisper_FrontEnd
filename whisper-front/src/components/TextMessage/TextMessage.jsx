// This renders sent or recieved text
// It is used by the last message

import { useRef } from "react";
import "./TextMessage.css";

const TextMessage = ({index, message}) => {
    const textRef = useRef(null);

    const maxLength =  54; // Set the maximum number of characters to display

    const trimmedMessage = message.length > maxLength
        ? `${message.slice(0, maxLength - 3)}...`
        : message;

    
    return ( 
        <p ref={textRef} className={`text-message ${index ? 'hovered' : ''}`}>
            {trimmedMessage}
        </p>
    );
}
 
export default TextMessage;