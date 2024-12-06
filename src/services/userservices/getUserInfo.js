import axios from 'axios'

export const getUserInfo = async (userId) => {
    try {
        const token = localStorage.getItem("token")
        const users = await axios.get(`http://localhost:5000/api/user/${userId}/info`, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true
        })

        console.log(users)

        return users.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}
