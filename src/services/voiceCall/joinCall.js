import axiosInstance from "../axiosInstance"

export const joinVoiceCall = async (chatId) => {
    try{
        const response = await axiosInstance.post(`/api/call/join/${chatId}`);
        return response.data.status == "success";
    } catch (error) {
        console.log(error);
    }
    return false;
}