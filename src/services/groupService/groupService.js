import axiosInstance from "../axiosInstance"
export const getMembers = async (groupId) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axiosInstance.get(`/api/chats/${groupId}/getMembers`,
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
export const searchMembers = async (groupId, query) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axiosInstance.get(`/api/chats/${groupId}/searchMembers`,
            {
                params: {
                    query
                }
            },
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
export const setPrivacy = async (groupId, privacy) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axiosInstance.post(`/api/chats/${groupId}/setPrivacy`, 
            { isPrivate: privacy },
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