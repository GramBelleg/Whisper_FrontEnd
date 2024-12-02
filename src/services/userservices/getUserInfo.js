import axios from 'axios'

export const getUserInfo = async (userId) => {
    try {
        const users = await axios.get(`http://localhost:5000/api/user/${userId}/info`, {
            withCredentials: true
        })

        console.log(users)

        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
