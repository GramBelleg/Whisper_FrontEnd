import axiosInstance from "../axiosInstance"

export const leaveVoiceCall = async (chatId, endStatus) => {
    try{
        const response = await axiosInstance.post(`/api/call/leave/${chatId}`,{
            endStatus: endStatus,
        });
        return response.data.status == "success";
    } catch (error) {
        console.log(error);
    }
    return false;
}