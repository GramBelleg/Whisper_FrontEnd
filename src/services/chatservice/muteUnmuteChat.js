import axios from 'axios'

export const muteChat = async (chatId, muteObject) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`https://whisper.webredirect.org/api/chats/${chatId}/muteChat`, muteObject, { 
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

export const unMuteChat = async (chatId, muteObject) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`https://whisper.webredirect.org/api/chats/${chatId}/muteChat`, muteObject, {
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
