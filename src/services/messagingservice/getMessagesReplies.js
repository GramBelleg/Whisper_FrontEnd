import apiUrl from "@/config"
import axios from "axios"

const getMessageReplies = async (messageId) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${apiUrl}/api/comments/${messageId}`,{
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true,
        })
        return response.data.comments
    } catch (error) {
        console.log(error)
        return [];
    }
}


export const getMessageRepliesCleaned = async (messageId) => {
    try {
        const replies = await getMessageReplies(messageId)
        if (replies) {
            replies.map((reply) => {
                reply.type = 'text';
                reply.sender = reply.userName;
            })
        }
        console.log(replies)
        return replies
    } catch (error) {
        console.log(error)
        return []
    }
}