import axios from 'axios'

export const putReadReceiptsSetting = async (enabled) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(
            'https://whisper.webredirect.org/api/user/readReceipts',
            { readReceipts: enabled },
            { 
                headers: {
                    Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
                    },
                withCredentials: true
            }
        )

        console.log('Response:', response.data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const putLastSeenVisibilitySettings = async (setting) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put('https://whisper.webredirect.org/api/user/lastSeen/privacy', { privacy: setting }, { headers: {
            Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
        },
        withCredentials: true })

        console.log('Response:', response.data)
        return response.data
    } catch (error) {
        throw error
    }
}
export const putAutoDownloadSize = async (size) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put('https://whisper.webredirect.org/api/user/setAutoDownloadSize', { size: size }, { headers: {
            Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
        },
        withCredentials: true })

        console.log('Response:', response.data)
        return response.data
    } catch (error) {
        throw error
    }
}
export const putStoriesVisibilitySettings = async (setting) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put('https://whisper.webredirect.org/api/user/story/privacy', { privacy: setting }, { headers: {
            Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
        },
        withCredentials: true })

        console.log('Response:', response.data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const putProfilePicVisibilitySettings = async (setting) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put('https://whisper.webredirect.org/api/user/pfp/privacy', { privacy: setting }, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true
        })

        console.log('Response:', response.data)
        return response.data
    } catch (error) {
        throw error
    }
}
