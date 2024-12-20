import axiosInstance from "../axiosInstance"
export const handleRegisterFCMToken = async (token) => 
{
    try {
        const res = await axiosInstance.post('/api/notifications/registerFCMToken', { fcmToken: token }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        console.log(res)
    } catch (error) {
        console.log(error)
        throw new Error('failed' + error.response.data.message)
    }
}