// This page Contains Stories and the chats
// It renders both stories page and chats page

import ChatList from '../ChatList/ChatList'
import '../ChatPage/ChatPage.css'

const ChatPage = () => {
    const chatList = [
        {
            name: 'Ziad Samer Mohamed Tawfik Radwan Gabr',
            profile_pic: '',
            message: 'hello',
            message_state: 'sent',
            muted: false,
            last_seen: '12:00:00',
            unread_notifications: 3,
            message_time: '2024-10-12 05:50:50',
            message_type: 'text'
        },
        {
            name: 'Zeyad Dawood',
            profile_pic: './assets/images/Grambell.png',
            message: 'ezyaka ysta, enta kont fen? bklmk mn embar7 telephonak',
            message_state: 'delivered',
            muted: false,
            last_seen: '10:00',
            unread_notifications: 2,
            message_time: '2024-10-11 04:21:21',
            message_type: 'text'
        },
        {
            name: 'Amr Mahmoud',
            profile_pic: './assets/images/Real_Madrid_CF.png',
            message: 'https://server11.mp3quran.net/yasser/001.mp3',
            message_state: 'read',
            muted: false,
            last_seen: '12:00',
            unread_notifications: 0,
            message_time: '2024-10-10 06:50:21',
            message_type: 'audio'
        },
        {
            name: 'Fatma Zenhom',
            profile_pic: './assets/images/messi.jpg',
            message: 'https://server11.mp3quran.net/yasser/001.mp3',
            message_state: 'sent',
            muted: true,
            last_seen: '12:00',
            unread_notifications: 0,
            message_time: '2023-09-11 11:48:12',
            message_type: 'audio'
        },
        {
            name: 'Hana Mostafa',
            profile_pic: './assets/images/ronaldo.jpeg',
            message: 'Ronaldo 2023',
            message_state: 'read',
            muted: false,
            last_seen: '12:00',
            unread_notifications: 0,
            message_time: '2024-10-12 05:50:50',
            message_type: 'text'
        }
    ]

    return (
        <div className='chat-page'>
            <div className='stories-container'>
                <h1>Stories</h1>
            </div>
            <div className='chat-list-container'>
                <ChatList chatList={chatList} />
            </div>
        </div>
    )
}

export default ChatPage
