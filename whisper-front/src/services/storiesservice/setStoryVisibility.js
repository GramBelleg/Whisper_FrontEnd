import axios from "axios";
import axiosInstance from "../axiosInstance"



export const setStoryPrivacySettings = async (storyId, privacy) => {

    try {
        console.log("Hello")
        const data = await axios.post('http://localhost:5000/api/user/story/privacy', 
            { 
                "storyId": storyId,
                "privacy": privacy
            }
            ,
            {
                withCredentials: true
            }
        );

        console.log("Changed Visibility")

    } catch (err) {
        throw err;
    }
}