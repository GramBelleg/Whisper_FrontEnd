import axios from 'axios'
import apiUrl from '@/config'

export const getStoryLikesAndViews = async (storyId) => {
    try {
        const token = localStorage.getItem("token")
        const meUser = JSON.parse(localStorage.getItem("user"))
        const response = await axios.get(`${apiUrl}/api/user/story/getViews/${storyId}`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })

        const users = response.data.users
        const views = users.length

        const likes = users.filter((user) => user.liked === true).length
        const Liked = users.some((user) => user.liked === true && user.userId === meUser.id)
        const Viewed = users.some((user) => user.userId === meUser.id)

        return {
            iLiked: Liked,
            likes,
            iViewed: Viewed,
            views
        }
    } catch (error) {
        console.error('Error fetching story likes and views:', error.message)
    }
}

export const getStoryViews = async (storyId) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${apiUrl}/api/user/story/getViews/${storyId}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            },
            withCredentials: true
        })
        const views = response.data.users.length
        return views
    } catch (error) {
        console.log('Error ', error.message)
    }
}
