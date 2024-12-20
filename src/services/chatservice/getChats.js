import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import apiUrl from '@/config'
import { readMedia } from './media'
import { downloadBlob } from '../blobs/blob'
import { getMembers } from './getChatMembers'

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
        console.log("chattt", chat)
        const flattenedChat = {
            id: chat.id, //
            othersId: chat.othersId, //
            name: chat.name, //
            type: chat.type, //
            selfDestruct: chat.selfDestruct ? chat.selfDestruct : null, //
            lastMessage: chat.lastMessage ? chat.lastMessage.content : null, //
            draftMessageContent: chat.draftMessage ? chat.draftMessage.draftContent : "", //
            draftMessageTime: chat.draftMessage ? chat.draftMessage.draftTime : "", //
            draftMessageParentId: chat.draftMessage ? chat.draftMessage.draftParentMessageId : "", //
            draftMessageParent: chat.draftMessage ? chat.draftMessage.parentMessage : "", //
            draftMessageTime: chat.draftMessage ? chat.draftMessage.draftTime : "", //
            messageTime: chat.lastMessage && chat.lastMessage.sentAt ? chat.lastMessage.sentAt.slice(0, 19).replace('T', ' ') : null,
            senderId: chat.lastMessage ? chat.lastMessage.sender.id : null,
            messageType: chat.lastMessage ? chat.lastMessage.type : null,
            messageState: mapMessageState(
                chat.lastMessage ? chat.lastMessage.read : false,
                chat.lastMessage ? chat.lastMessage.delivered : false
            ),
            lastMessageId: chat.lastMessage ? chat.lastMessage.id : null, 
            lastMessageState: chat.lastMessage ? mapMessageState(chat.read, chat.delivered) : null,
            media: chat.lastMessage && chat.lastMessage.media ? chat.lastMessage.media : '', 
            hasStory: chat.hasStory !== null ? chat.hasStory : false, //
            isMuted: chat.isMuted !== null ? chat.isMuted : false,
            participantKeys: chat.participantKeys, //
            profilePic: await mapPicture(chat.picture), //
            unreadMessageCount: chat.unreadMessageCount, //
            sender: chat.lastMessage ? chat.lastMessage.sender.userName : null,
            lastSeen: chat.lastSeen ? chat.lastSeen.slice(0, 19).replace('T', ' ') : null, //
            status: chat.status,
            members: await getMembers(chat.id)
        }
        let isAdmin = false
        if (flattenedChat.members) {
            const user = JSON.parse(localStorage.getItem("user"));
            const admins = flattenedChat.members.filter((member) => member.isAdmin)
            isAdmin = admins.filter((admin) => admin.id === user.id).length > 0
        }
        return {...flattenedChat, isAdmin: isAdmin}
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
