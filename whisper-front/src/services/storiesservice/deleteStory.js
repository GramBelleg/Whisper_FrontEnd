import axiosInstance from "../axiosInstance";



export const deleteStory = async (storyId) => {
    try {
        const response = await axiosInstance.delete(`/myStories?id=${storyId}`);
        
        console.log(response.status)
    
        return response;
    } catch (err) {
        throw err;
    }
}