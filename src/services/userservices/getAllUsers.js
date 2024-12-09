import apiUrl from '@/config'
import axios from 'axios'
import { mapPicture } from '../chatservice/getChats'


export const cleanUser = async (user) => {
    try {
        const flattenedUser = {
            id: user.id,
            userName: user.userName,
            profilePic: await mapPicture(user.profilePic), 
        }
        return flattenedUser
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllUsersAPI = async () => {
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


export const getAllUsers = async () => {
    try {
        const users = await getAllUsersAPI()
        const cleanedUsers = await Promise.all(
            users.map(user => cleanUser(user))
        );

        const validUsers = cleanedUsers.filter(user => user !== null);
        return validUsers
    } catch (error) {
        console.log('Error ', error.message)
    }
}
