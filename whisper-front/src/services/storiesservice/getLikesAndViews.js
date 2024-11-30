import axios from "axios";


export const getStoryLikesAndViews = async (storyId) => {
    try {
        //const stories = await axiosInstance.get("/stories");
        const response = await axios.get(`http://localhost:5000/api/user/story/getViews/${storyId}`,{
            withCredentials: true
        });
        
        const views = response.data.users.length;

        const users = response.data.users;

        const likes = (users.filter((user) => user.liked)).length;

        return { likes , views};
    } catch (error) {
        console.log("Error ", error.message)
    }
}

export const getStoryViews = async (storyId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/user/story/getViews/${storyId}`,{
            withCredentials: true
        });
        const views = response.data.users.length;
        return views;
    } catch (error) {
        console.log("Error ", error.message)
    }
}
