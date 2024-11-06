import axiosInstance from "../axiosInstance";
import axios from "axios";
import { whoAmI } from "../chatservice/whoAmI";

export const getProfilePic = async () => {
    try
    {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const userId= user.userId;
        const blobResponse = await axios.get(`http://localhost:5000/getPic/${whoAmI.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },{
          withCredentials: true
        }); //returns the blob name [should be a socket]
        const { blobName } = blobResponse.data.blobName;
        const urlResponse= await axios.get(`http://localhost:5000/getPicUrl/${blobName}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
        },
        {
          withCredentials: true 
        }
      ); //returns the preassigned url 
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

export const updateBio = async (bio) => {
    try {
      const response = await axiosInstance.put('/updateBio', { bio });
      return response.data;
    } catch (error) {
      console.error('Error updating bio:', error);
      throw error;
    }
  };

  export const updateName = async (name) => {
    try {
      const response = await axiosInstance.put('/updateName', { name });
      return response.data;
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  };

  export const updateUserName = async (userName) => {
    try {
      const response = await axiosInstance.put('/updateUsername', { userName });
      return response.data;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  };

  export const updatePhone = async (phone) => {
    try {
      const response = await axiosInstance.put('/updatePhone', { phone });
      return response.data;
    } catch (error) {
      console.error('Error updating phone:', error);
      throw error;
    }
  };

  export const updateEmail = async (email,code) => {
    try {
      const response = await axiosInstance.put('/updateEmail', { email,code });
      return response.data;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  export const sendUpdateCode = async (email) => {
    try {
      console.log("code sent to email");
      const response = await axiosInstance.put('/sendUpdateCode', { email });
      return response.data;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };
