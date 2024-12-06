import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import axiosInstance from '../axiosInstance'
import apiUrl from '@/config'

let myChats = []
let myUsers = []

export const getChatsAPI = async (filters = {}) => {
    try {
        const token = localStorage.getItem("token")
        const chats = await axios.get(`${apiUrl}/api/chats`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, // Ensure credentials are included
            params: filters
        })

        return chats.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}

// Function to map message_state values
export const mapMessageState = (read, delivered) => {
    if (!read && !delivered) {
        return 0
    } else if (delivered && !read) {
        return 1
    } else {
        return 2
    }
}

export const getChatsCleaned = async (filters = {}) => {
    try {
        const chats = await getChatsAPI(filters)

        myChats = []

        // TODO: "picture": "string", chat.picture
        // const downloadedData = await getDownloadData();
        // const blob = await downloadAttachment(downloadedData);
        // const finalBlob = new Blob([blob]);
        // const newObjectUrl = URL.createObjectURL(finalBlob);

        chats.map((chat) => {
            const flattenedChat = {
                id: chat.id,
                othersId: chat.othersId, // TODO: handle with back
                name: chat.name,
                type: chat.type,
                lastMessage: chat.lastMessage ? chat.lastMessage.content : null,
                drafted: chat.lastMessage ? chat.lastMessage.drafted : false,
                messageTime: chat.lastMessage && chat.lastMessage.sentAt ? chat.lastMessage.sentAt.slice(0, 19).replace('T', ' ') : null,
                // forwarded: false, // TODO: to be removed
                senderId: chat.lastMessage ? chat.lastMessage.sender.id : null,
                messageType: chat.lastMessage ? chat.lastMessage.type : null,
                messageState: mapMessageState(
                    chat.lastMessage ? chat.lastMessage.read : false,
                    chat.lastMessage ? chat.lastMessage.delivered : false
                ),
                lastMessageId: chat.lastMessage ? chat.lastMessage.id : null, // WHY?
                media: chat.lastMessage && chat.lastMessage.media ? chat.lastMessage.media : '', // TODO: to be removed
                story: chat.hasStory !== null ? chat.hasStory : false,
                muted: chat.isMuted !== null ? chat.isMuted : false,
                profilePic: noUser, // TODO
                unreadMessageCount: chat.unreadMessageCount,
                sender: chat.lastMessage ? chat.lastMessage.sender.userName : null,
                lastSeen: chat.lastSeen ? chat.lastSeen.slice(0, 19).replace('T', ' ') : null,
                status: chat.status
                /*
                    
                */
            }

            myChats.push(flattenedChat)
        })

        setUsers()
        return myChats
    } catch (error) {
        console.log('Error ', error.message)
    }
}

const setUsers = () => {
    myUsers = []

    myChats.map((chat) => {
        const user = {
            userId: chat.othersId,
            correspondingChatId: chat.id,
            name: chat.sender,
            profilePic: chat.profilePic,
            lastSeen: chat.lastSeen
        }
        myUsers.push(user)
    })
}

export const getUserForChat = (id) => {
    if (myUsers) {
        const requiredUser = myUsers.find((user) => user.correspondingChatId === id)
        if (requiredUser) {
            return requiredUser
        }
    }
    return null
}
