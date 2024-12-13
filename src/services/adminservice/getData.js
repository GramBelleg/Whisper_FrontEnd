import axios from 'axios'
import noUser from '../../assets/images/no-user.png'
import apiUrl from '@/config'
import { mockUsers } from '@/services/mock/mockData'
import { mockGroups } from '@/services/mock/mockData'
let users = []
let groups = []
export const getUsers = async () => {
    return mockUsers
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`${apiUrl}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, 
        })
        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
export const getGroups = async () => {
    return mockGroups
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`${apiUrl}/api/admin/groups`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true, 
        })
        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
