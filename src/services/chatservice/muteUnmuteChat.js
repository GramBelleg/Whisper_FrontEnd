import apiUrl from '@/config'
import axios from 'axios'

export const muteChat = async (chatId, muteObject) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/chats/${chatId}/muteChat`, muteObject, { 
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

export const unMuteChat = async (chatId, muteObject) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/chats/${chatId}/unmuteChat`, muteObject, {
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
