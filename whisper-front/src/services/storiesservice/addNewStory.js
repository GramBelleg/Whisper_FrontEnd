import axiosInstance from "../axiosInstance";


export const addNewStory = async (newStory) => {

    let correct = false;
    let error = null;
    try {
        const response = await axiosInstance.put('/myStories', newStory);
        console.log('New story added:', response.data);

        correct = true;
        
    } catch (err) {
        console.error('Error adding new story:', err);
        error = err;
    }

    return { correct, error };
};