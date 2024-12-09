import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import apiUrl from '@/config'
import { readMedia } from './media'
import { downloadBlob } from '../blobs/blob'

export const getChatsAPI = async (filters = {}) => {
    try {
        const token = localStorage.getItem("token")
        const chats = await axios.get(`${apiUrl}/api/chats`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, 
            params: filters
        })
        console.log(chats)
        return chats.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}

export const mapMessageState = (read, delivered) => {
    if (!read && !delivered) {
        return 0
    } else if (delivered && !read) {
        return 1
    } else {
        return 2
    }
}

export const mapPicture = async (picture) => {
    try {
        if (picture) {
            const type = picture.substring(picture.lastIndexOf('.') + 1)
            const presignedUrl = await readMedia(picture)
            const { blob } = await downloadBlob({ presignedUrl: presignedUrl })
            const newBlob = new Blob([blob], { type: type })
            const objectUrl = URL.createObjectURL(newBlob)
            console.log(objectUrl)
            return objectUrl
        } 
        return noUser
    } catch (error) {
        console.log(error)
        return noUser
    }
}

export const cleanChat = async (chat) => {
    try {
        const flattenedChat = {
            id: chat.id,
            othersId: chat.othersId, 
            name: chat.name,
            type: chat.type,
            lastMessage: chat.lastMessage ? chat.lastMessage.content : null,
            drafted: chat.lastMessage ? chat.lastMessage.drafted : false,
            messageTime: chat.lastMessage && chat.lastMessage.sentAt ? chat.lastMessage.sentAt.slice(0, 19).replace('T', ' ') : null,
            senderId: chat.lastMessage ? chat.lastMessage.sender.id : null,
            messageType: chat.lastMessage ? chat.lastMessage.type : null,
            messageState: mapMessageState(
                chat.lastMessage ? chat.lastMessage.read : false,
                chat.lastMessage ? chat.lastMessage.delivered : false
            ),
            lastMessageId: chat.lastMessage ? chat.lastMessage.id : null, 
            media: chat.lastMessage && chat.lastMessage.media ? chat.lastMessage.media : '', 
            story: chat.hasStory !== null ? chat.hasStory : false,
            muted: chat.isMuted !== null ? chat.isMuted : false,
            participantKeys: chat.participantKeys,
            profilePic: await mapPicture(chat.picture), 
            unreadMessageCount: chat.unreadMessageCount,
            sender: chat.lastMessage ? chat.lastMessage.sender.userName : null,
            lastSeen: chat.lastSeen ? chat.lastSeen.slice(0, 19).replace('T', ' ') : null,
            status: chat.status
        }
        return flattenedChat
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getChatsCleaned = async (filters = {}) => {
    try {
        const chats = await getChatsAPI(filters)
        const cleanedChats = await Promise.all(
            chats.map(chat => cleanChat(chat))
        );

        const validChats = cleanedChats.filter(chat => chat !== null);

        return validChats
    } catch (error) {
        console.log('Error ', error.message)
    }
}
