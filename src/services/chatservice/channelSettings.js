import axiosInstance from "../axiosInstance"

export const getChannelSettings = async (channelId) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axiosInstance.get(`/api/channels/${channelId}/settings`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        )
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error)
        throw new Error('failed' + error.response.data.message)
    }
}