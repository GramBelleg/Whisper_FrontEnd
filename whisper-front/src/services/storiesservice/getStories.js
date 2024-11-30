import axios from "axios"

let myStories = [];

export const getStoriesAPI = async (id) => {
    try {
        
        const response = await axios.get(`http://localhost:5000/api/user/story/${id}`,{
            withCredentials: true
        });
            
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getStories = async (id) => {
    try {
        
        const response = await getStoriesAPI(id);

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

export const getUsersWithStoriesAPI = async () => {

    try {
        //const stories = await axiosInstance.get("/stories");
        const stories = await axios.get(`http://localhost:5000/api/user/story`,{
            withCredentials: true
        });
        console.log(stories.data);

        return stories.data;
    } catch (error) {
        console.log("Error ", error.message)
    }
}

export const getUsersWithStoriesCleaned = async () => {
    try {
        const stories = await getUsersWithStoriesAPI();
        myStories = []
        
        stories.users.users.map((story) => {
            const flattenedStory = {
                id: story.id,
                userName: story.userName,
                profilePic: story.profilePic
            };
            myStories.push(flattenedStory);
        });
        return myStories;
        
    } catch (error) {
        console.log("Error " ,error.message);
    }
}