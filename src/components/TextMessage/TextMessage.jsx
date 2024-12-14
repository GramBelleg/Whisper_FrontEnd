import { useRef } from 'react'
import './TextMessage.css'

const TextMessage = ({ message }) => {
    
    const textRef = useRef(null)
    
    const maxLength = 54 
    const trimmedMessage = message?.length > maxLength ? `${message.slice(0, maxLength - 3)}...` : message
    return (
        <p ref={textRef} className={`text-message`}>
            {trimmedMessage}
        </p>
    )
}

export default TextMessage
