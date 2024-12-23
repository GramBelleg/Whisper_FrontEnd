import ChatMessage from '../ChatMessage/ChatMessage'
import { useChat } from '@/contexts/ChatContext'
import './SingleChatMessagesList.css'
import { useEffect } from 'react'

const SingleChatMessagesList = () => {
    const { messages } = useChat()

    useEffect(() => {}, [messages])

    return (
        <div className='single-chat-messages-list'>
            {messages?.map((message) => (
                <ChatMessage key={message.id} id={`message-${message.id}`} message={message} />
            ))}
        </div>
    )
}

export default SingleChatMessagesList