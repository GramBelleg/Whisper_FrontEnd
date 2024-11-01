import axiosInstance from "../axiosInstance";
import axios from "axios";

export const getProfilePic = async () => {
    try
    {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const userId= user.userId;
        const blobResponse = await axios.get(`http://localhost:5000/getPic/${userId}`, {
        headers: {
        'Authorization': `Bearer ${token}`,
        },
        }); //returns the blob name [should be a socket]
        const { blobName } = blobResponse.data.blobName;
        const urlResponse= await axios.get(`http://localhost:5000/getPicUrl/${blobName}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        }); //returns the preassigned url 
        const { preAssignedUrl } = blobResponse.data.blobName;
        const response = await axios.get(preAssignedUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;

    }
    catch (error)
    {
        console.log(error);
        throw new Error(error.response?.data?.message || "An error occurred");
    }

};
