// This renders sent or recieved text
// It is used by the last message

import { useEffect, useRef, useState } from "react";
import "./TextMessage.css";

const TextMessage = ({index, message}) => {
    const textRef = useRef(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);

    useEffect(() => {
        const checkTextOverflow = () => {
            if (textRef.current) {
              const { scrollWidth, clientWidth } = textRef.current;
              setIsTextOverflowing(scrollWidth > clientWidth);
            } 
          };
      
        checkTextOverflow();
        window.addEventListener("resize", checkTextOverflow);

        return () => {
            window.removeEventListener("resize", checkTextOverflow);
        };
    })
    return ( 
        <p ref={textRef} className={`text-message ${isTextOverflowing ? 'overflow' : ''} ${index ? 'hovered' : ''}`}>
            {message}
        </p>
    );
}
 
export default TextMessage;