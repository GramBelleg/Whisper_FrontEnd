import apiUrl from '@/config'
import axios from 'axios'

export const setStoryPrivacySettings = async (storyId, privacy) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put(
            `${apiUrl}/api/user/story/${storyId}/privacy`,
            {
                privacy: privacy
            },
            { headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true }
        )

        console.log(response)
    } catch (err) {
        throw err
    }
}
