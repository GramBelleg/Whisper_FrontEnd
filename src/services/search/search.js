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

export const chatsLocalSearch = async (chatId, query) => {
    try {
        const token = localStorage.getItem('token')
        console.log(chatId, query)
        const response = await axios.get(`${apiUrl}/api/chats/${chatId}/searchMembers?query=${query}`,
                { withCredentials: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        )
        return response.data.users
    } catch (error) {
        console.log(error)
    }
}


export const messagesLocalSearch = async (chatId, query, type) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/messages/${chatId}/search?query=${query}&type=${type}`,
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