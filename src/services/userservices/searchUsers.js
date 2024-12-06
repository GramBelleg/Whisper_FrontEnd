import axiosInstance from "../axiosInstance";


export const searchUsers = async (query) => {
    const response = await axiosInstance.post(`/api/user/search`,{
        query
    });
    return response.data;
}