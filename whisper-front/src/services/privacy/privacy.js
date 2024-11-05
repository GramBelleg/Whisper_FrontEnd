import axiosInstance from '@/services/axiosInstance';


export const putReadReceiptsSetting = async (enabled) => {
    try {
        const response = await axiosInstance.post('http://localhost:5001/api/user/readReceipts', 
            { readReceipts: enabled }
        );

        console.log('Response:', response.data);
        if (response.ok) {
            return response.data;
        }
        else {
            throw new Error("Error Fetching data from backend");
        }
    } catch (error) {
        throw error;
    }
}