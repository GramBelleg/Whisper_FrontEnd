import axios from 'axios'

export const draftMessage = async (chatId, draftedMessage) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`http://localhost:5000/api/messages/${chatId}/draftMessage`, draftedMessage, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
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
        await axios.put(`http://localhost:5000/api/messages/${chatId}/undraftMessage`, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true
        })

        return true
    } catch (error) {
        throw error
    }
}
