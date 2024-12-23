import axiosInstance from "../axiosInstance"

export const generateVoiceCallToken = async (chatId, userId) => {
    try{
        const response = await axiosInstance.get(`/api/call/${chatId}`, {
            params:{
                userId: userId
            },
        });
        return response.data.token;
    } catch (error) {
        console.log(error);
    }
    return null;
}