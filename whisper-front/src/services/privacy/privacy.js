import axios from 'axios';


export const putReadReceiptsSetting = async (enabled) => {
    try {
        const response = await axios.post('http://localhost:5000/api/user/readReceipts', 
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
        const response = await axios.put('http://localhost:5000/api/user/lastSeen/privacy', 
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
        const response = await axios.put('http://localhost:5000/api/user/pfp/privacy', 
            { "privacy": setting },
            { withCredentials: true }
        );
        

        console.log('Response:', response.data);
        return response.data;
    
    } catch (error) {
        throw error;
    }
}