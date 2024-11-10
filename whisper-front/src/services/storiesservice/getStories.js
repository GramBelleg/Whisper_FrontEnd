import axios from "axios"
import axiosInstance from "../axiosInstance";
import { whoAmI } from "../chatservice/whoAmI";

let myStories = [];

export const getMyStoriesAPI = async () => {
    try {
        
        const response = await axios.get(`http://localhost:5000/api/user/story/${whoAmI.id}`,{
            withCredentials: true
        });
            
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getMyStories = async () => {
    try {
        
        const response = await getMyStoriesAPI();

        console.log(response)
        const tempStories =  response.stories;  

        

        myStories = [];

        tempStories.map((story) => {
            const flattenedStory = {
                id: story.id,
                content: story.content,
                media: story.media,
                type: story.type,
                likes: story.likes,
                date: story.date.slice(0, 19).replace("T", " "),
                privacy: story.privacy,
            };

            myStories.push(flattenedStory);
        });

        return myStories;
    } catch (error) {
        console.error(error);
    }
            
}

export const getStoriesAPI = async () => {

    try {
        const stories = await axiosInstance.get("/stories");

        console.log(stories.data);

        return stories.data;
    } catch (error) {
        console.log("Error ", error.message)
    }
}

export const getStoriesCleaned = async () => {
    try {
        
        const stories = await getStoriesAPI();

        myStories = []
        
        stories.map((story) => {
            const flattenedStory = {
                id: story.id,
                content: story.content, 
                media: story.media,
                likes: story.likes,
                time: story.time
            };
            myStories.push(flattenedStory);
        });
        return myStories;
        
        
    } catch (error) {
        console.log("Error " ,error.message);
    }
    
    
}