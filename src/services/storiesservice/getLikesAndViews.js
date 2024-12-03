import axios from 'axios'
import { whoAmI } from '../chatservice/whoAmI'

export const getStoryLikesAndViews = async (storyId) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`https://whisper.webredirect.org/api/user/story/getViews/${storyId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true
        })

        const users = response.data.users
        const views = users.length

        const likes = users.filter((user) => user.liked === true).length
        const Liked = users.some((user) => user.liked === true && user.userId === whoAmI.userId)
        const Viewed = users.some((user) => user.userId === whoAmI.userId)

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
        const response = await axios.get(`https://whisper.webredirect.org/api/user/story/getViews/${storyId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true
        })
        const views = response.data.users.length
        return views
    } catch (error) {
        console.log('Error ', error.message)
    }
}
