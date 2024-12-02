import axios from 'axios';


export const putReadReceiptsSetting = async (enabled) => {
    try {
            { readReceipts: enabled },
            { withCredentials: true }
        );
        

        console.log('Response:', response.data);
        return response.data;
       
    } catch (error) {
        throw error;
    }
}


export const putLastSeenVisibilitySettings = async (setting) => {
    try {
            { "privacy": setting },
            { withCredentials: true }
        );
        

        console.log('Response:', response.data);
        return response.data;
    
    } catch (error) {
        throw error;
    }
}

export const putStoriesVisibilitySettings = async (setting) => {
    try {
            { "privacy": setting },
            { withCredentials: true }
        );
        

        console.log('Response:', response.data);
        return response.data;
    
    } catch (error) {
        throw error;
    }
}

export const putProfilePicVisibilitySettings = async (setting) => {
    try {
            { "privacy": setting },
            { withCredentials: true }
        );
        

        console.log('Response:', response.data);
        return response.data;
    
    } catch (error) {
        throw error;
    }
}