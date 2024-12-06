import apiUrl from '@/config'
import axios from 'axios'

export const draftMessage = async (chatId, draftedMessage) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/messages/${chatId}/draftMessage`, draftedMessage, {
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

export const unDraftMessage = async (chatId) => {
    try {
        const token = localStorage.getItem("token")
        await axios.put(`${apiUrl}/api/messages/${chatId}/undraftMessage`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })

        return true
    } catch (error) {
        throw error
    }
}
