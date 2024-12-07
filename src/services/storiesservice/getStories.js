import axios from 'axios'
import apiUrl from '@/config'

let myStories = []

export const getStoriesAPI = async (id) => {
    try {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        const response = await axios.get(`${apiUrl}/api/user/story/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })

        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getStories = async (id) => {
    try {
        const response = await getStoriesAPI(id)
        const tempStories = response.stories

        const myStories = await Promise.all(
            tempStories.map(async (story) => {
                let flattenedStory = {
                    id: story.id,
                    content: story.content,
                    media: story.media,
                    type: story.type,
                    likes: story.likes,
                    date: story.date.slice(0, 19).replace('T', ' '),
                    privacy: story.privacy
                }

                try {
                    const { iLiked, likes, iViewed, views } = await getStoryLikesAndViews(story.id)
                    flattenedStory.liked = iLiked
                    flattenedStory.viewed = iViewed
                    flattenedStory.likes = likes
                    flattenedStory.views = views
                } catch (error) {
                    console.error(`Error fetching likes and views for story ID ${story.id}:`, error)
                }

                return flattenedStory
            })
        )

        return myStories
    } catch (error) {
        console.error(error)
        return []
    }
}

export const getUsersWithStoriesAPI = async () => {
    try {
        const token = localStorage.getItem("token")
        const stories = await axios.get(`${apiUrl}/api/user/story`, {
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })

        return stories.data
    } catch (error) {
        console.log('Error ', error.message)
    }
}

export const getUsersWithStoriesCleaned = async (iHaveStory) => {
    try {
        const stories = await getUsersWithStoriesAPI()
        myStories = []
        const user = localStorage.getItem("user")
        iHaveStory = false
        stories.users.users.map((story) => {
            if (story.id === user.id) {
                iHaveStory = true
            }
            const flattenedStory = {
                id: story.id,
                userName: story.userName,
                profilePic: story.profilePic
            }
            myStories.push(flattenedStory)
        })
        return myStories
    } catch (error) {
        console.log('Error ', error.message)
    }
}
