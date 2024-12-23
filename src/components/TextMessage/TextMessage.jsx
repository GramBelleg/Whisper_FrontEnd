import { useRef } from 'react'
import './TextMessage.css'
import MessageRenderer from '../ChatMessage/MessageRenderer'

const TextMessage = ({ message }) => {
    return (
        <MessageRenderer content={message} />
    )
}

export default TextMessage
