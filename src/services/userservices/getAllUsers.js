import apiUrl from '@/config'
import axios from 'axios'

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${apiUrl}/api/user/contact`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })


        return response.data.users
    } catch (error) {
        console.log('Error ', error.message)
    }
}
