import axios from "axios"

let myStories = [];

export const getStoriesAPI = async () => {

    try {
        const stories = await axios.get("http://localhost:5000/api/stories", {
            withCredentials: true, // Ensure credentials are included
        });

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