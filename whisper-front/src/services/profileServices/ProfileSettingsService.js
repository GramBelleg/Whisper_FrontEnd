import axiosInstance from "../axiosInstance";
import axios from "axios";
import { whoAmI } from "../chatservice/whoAmI";
import UserSocket from "../sockets/UserSocket";
import { downloadBlob, uploadBlob } from "@/services/blobs/blob";
import useAuth from "@/hooks/useAuth";

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
  
  export const updateProfilePic = async (userID,file) => {
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
  
      userSocket.setProfilePic(userID,blobName);

      console.log("Profile picture updated successfully");
      
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw new Error(error.response?.data?.message || "An error occurred while updating the profile picture");
    }
  };


  export const getProfilePic = async (userID, blobName) => {
    console.log("getProfilePic called");
    const token = localStorage.getItem("token");

    try {
        const profilePicBlobName = await new Promise((resolve) => {
            let timeoutReached = false;

            const timeout = setTimeout(() => {
                timeoutReached = true;
                console.log("Socket response timed out, using fallback blob name");
                resolve(blobName);
            }, 2000);

            userSocket.getProfilePic(userID,(error, socketBlobName) => {
                if (!timeoutReached) {
                    clearTimeout(timeout);
                    if (error || !socketBlobName) {
                        console.log("Failed to get profile picture from socket, using fallback blob name");
                        resolve(blobName);
                    } else {
                        console.log("Profile picture blob name from socket:", socketBlobName);
                        resolve(socketBlobName);
                    }
                }
            });
        });

        if (!profilePicBlobName) {
            console.log("No profile picture blob name available");
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


  export const deleteProfilePic = async () => {
    try {
      console.log("deleteProfilePic called");

      const response = await axios.put("http://localhost:5000/api/user/profilepic", 
        {blobName: null},
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.status === 200) {
        // this.socket.emit("pfp", { profilePic: blobName });
        console.log("Sent profile pic set event with blobName:", blobName);
    } else {
        console.error("Failed to set profile picture:", response.statusText);
    }
   
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      throw new Error(error.response?.data?.message || "An error occurred while deleting the profile picture");
    }
  };