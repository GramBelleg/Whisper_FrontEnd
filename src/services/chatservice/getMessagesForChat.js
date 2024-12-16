import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import apiUrl from '@/config'
import { getMessageRepliesCleaned } from '../messagingservice/getMessagesReplies'

export const getMessagesForChatFromAPI = async (id) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${apiUrl}/api/messages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw error
    }
}

// Function to map message_state values
const mapMessageState = (read, delivered) => {
    if (!read && !delivered) {
        return 0
    } else if (delivered && !read) {
        return 1
    } else {
        return 2
    }
}

export const mapMessage = async (message) => {
    const tempMessage = {
        id: message.id,
        chatId: message.chatId,
        mentions: message.mentions, // TODO: handle mentions
        content: message.content,
        media: message.media, // TODO: handle this
        extension: message.extension, // TODO: handle this
        time: message.time.slice(0, 19).replace('T', ' '),
        sentAt: message.sentAt.slice(0, 23).replace('T', ' '), // TODO: handle this
        state: mapMessageState(message.read, message.delivered), // TODO: handle pending
        forwarded: message.forwarded,
        forwardedFrom: message.forwardedFrom,
        expiresAfter: message.expiresAfter,
        pinned: message.pinned,
        selfDestruct: message.selfDestruct,
        type: message.type,
        edited: message.edited,
        isSecret: message.isSecret,
        isAnnouncement: message.isAnnouncement,
        parentMessage: message.parentMessage,
        sender: message.sender.userName,
        senderId: message.sender.id,
        profilePic: noUser,
        attachmentType: message.attachmentType,
        size: message.size,
        attachmentName: message.attachmentName,
        replyCount: message.replyCount ? message.replyCount : 0,
        replies : message.replyCount && message.replyCount > 0 ? await getMessageRepliesCleaned(message.id) : []
    }
    return tempMessage
}

export const getMessagesForChatCleaned = async (id) => {
    try {
        const messages = await getMessagesForChatFromAPI(id)
        let myMessages;

        if (messages && messages.messages) {
            myMessages = await Promise.all(
                messages.messages.map((message) => mapMessage(message)));
        }

        return myMessages
    } catch (error) {
        throw error
    }
}

export const getPinnedMessagesForChat = async (id) => {
    try {
        const messages = await getMessagesForChatFromAPI(id) // TODO: handle with IndexedDB
        let pinnedMessages = []

        if (messages && messages.pinnedMessages.length > 0) {
            pinnedMessages = [...messages.pinnedMessages]
        } else {
            throw new Error('No pinned messages found')
        }

        return pinnedMessages
    } catch (error) {
        throw error
    }
}
