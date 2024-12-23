import { useEffect, useState } from 'react'
import ChatItem from '../ChatItem/ChatItem'
import './ChatList.css'

const ChatList = ({ chatList }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    useEffect(() => {}, [chatList])

    return (
        <div className='chat-list'>
            {chatList?.map((chat, index) => {
                return (
                    <div
                        key={index}
                        className='chat-item-container'
                        onMouseEnter={() => {
                            setHoveredIndex(index)
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <ChatItem index={index === hoveredIndex} standaloneChat={chat} />
                    </div>
                )
            })}
        </div>
    )
}

export default ChatList
