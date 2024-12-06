import axios from 'axios'

export const setStoryPrivacySettings = async (storyId, privacy) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.put(
            `http://localhost:5000/api/user/story/${storyId}/privacy`,
            {
                privacy: privacy
            },
            { headers: {
                Authorization: `Bearer ${token}` // Use the appropriate scheme (Bearer, Basic, etc.)
            },
            withCredentials: true }
        )

        console.log(response)
    } catch (err) {
        throw err
    }
}
