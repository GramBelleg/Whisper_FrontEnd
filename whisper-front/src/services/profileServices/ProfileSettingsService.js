import axiosInstance from "../axiosInstance";
import axios from "axios";
import { whoAmI } from "../chatservice/whoAmI";
import UserSocket from "../sockets/UserSocket";
import { downloadBlob, uploadBlob } from "@/services/blobs/blob";

const userSocket = new UserSocket();
const userId = whoAmI.id;

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
  
  export const updateProfilePic = async (file) => {
    try {
      console.log("updateProfilePic called");
      const token = localStorage.getItem("token");
  
      // Request to get a presigned URL for uploading
      const blobResponse = await axiosInstance.post(
        'api/media/write',
        {
          fileName: file.name,
          fileType: file.type,
          fileExtension: file.name.split('.').pop()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      if (!blobResponse || !blobResponse.data || !blobResponse.data.presignedUrl || !blobResponse.data.blobName) {
        throw new Error("Invalid response structure from API.");
      }
  
      const { presignedUrl, blobName } = blobResponse.data;
      const newUrl = presignedUrl.replace("https://whisperblob.blob.core.windows.net", "api");
  
      // Upload the file to the blob storage using the presigned URL
      await uploadBlob(file, { presignedUrl: newUrl, blobName });
      console.log("File uploaded successfully");
  
      userSocket.setProfilePic(blobName);

      console.log("Profile picture updated successfully");
      
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw new Error(error.response?.data?.message || "An error occurred while updating the profile picture");
    }
  };
  
  export const getProfilePic = async () => {
    try {
      console.log("getProfilePic called");
      const token = localStorage.getItem("token");
  
      const profilePicBlobName = await userSocket.getProfilePic(userId);
      console.log('Profile picture blob name:', profilePicBlobName);
  
      if (!profilePicBlobName) {
        return null; 
      }
  
      const blobResponse = await axiosInstance.post(
        'api/media/read',
        { blobName: profilePicBlobName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      console.log("Blob response:", blobResponse);
      const { blob } = await downloadBlob(blobResponse.data);
      const newBlob = new Blob([blob]);
      const objectUrl = URL.createObjectURL(newBlob);
      return objectUrl;
  
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      throw new Error(error.response?.data?.message || "An error occurred while fetching the profile picture");
    }
  };