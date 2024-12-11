import axiosInstance from "../axiosInstance"

export const setPrivacy = async (groupId, privacy) => {
    try {
        const chatPrivacy = privacy === 'Public' ? false : true
    
        const token = localStorage.getItem("token")
        const res = await axiosInstance.post(`/api/chats/${groupId}/privacy`, 
            { isPrivate: chatPrivacy },
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        )
        return res.data
    } catch (error) {
        console.log(error)
        throw new Error('failed' + error.response.data.message)
    }
}

export const setGroupLimit = async (groupId, limit) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axiosInstance.put(`/api/groups/${groupId}/size/${limit}`, 
            { maxSize: limit },
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        )
        return res.data
    } catch (error) {
        console.log(error)
        throw new Error('failed' + error.response.data.message)
    }
};