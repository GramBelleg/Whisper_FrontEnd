import apiUrl from "@/config"
import axios from "axios"



export const chatsGlobalSearch = async (query) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/chats/globalSearch?query=${query}`,
                { withCredentials: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        )
        return response.data.chats
    } catch (error) {
        console.log(error)
    }
}


export const messagesGlobalSearch = async (query, type) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/messages/global/search?query=${query}&type=${type}`,
                { withCredentials: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        )
        return response.data.messages
    } catch (error) {
        console.log(error)
    }
}