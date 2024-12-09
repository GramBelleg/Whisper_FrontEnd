import apiUrl from '@/config'
import axios from 'axios'

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${apiUrl}/api/user/contact`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        console.log(response)

        return response.data.users
    } catch (error) {
        console.log('Error ', error.message)
    }
}
