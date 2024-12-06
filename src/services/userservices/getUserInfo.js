import apiUrl from '@/config'
import axios from 'axios'

export const getUserInfo = async (userId) => {
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`${apiUrl}/api/user/${userId}/info`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })

        console.log(users)

        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
