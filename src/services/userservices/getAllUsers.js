import apiUrl from '@/config'
import axios from 'axios'

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${apiUrl}/api/admin/getUsers`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })


        return response.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
