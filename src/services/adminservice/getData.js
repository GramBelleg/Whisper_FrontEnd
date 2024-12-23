import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import apiUrl from '@/config'

let users = []
let groups = []
export const getUsers = async () => {
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`${apiUrl}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, 
        })
        console.log(users,"received users")
        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
export const getGroups = async () => {
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`${apiUrl}/api/admin/groups`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, 
        })
        console.log(users,"received groups")
        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
