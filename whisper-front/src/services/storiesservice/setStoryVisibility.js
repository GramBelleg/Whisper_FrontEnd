import axios from "axios";

export const setStoryPrivacySettings = async (storyId, privacy) => {

    try {
        const response = await axios.put(`http://localhost:5000/api/user/story/${storyId}/privacy`, 
            { 
                "privacy": privacy
            },
            { withCredentials: true }
            
        );
        
        console.log(response)
    } catch (err) {
        throw err;
    }
}