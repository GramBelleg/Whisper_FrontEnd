import axiosInstance from "../axiosInstance";
import axios from "axios";
import { whoAmI } from "../chatservice/whoAmI";
import { socket } from "../messagingservice/sockets/sockets";
import { downloadBlob, uploadBlob } from "@/services/blobs/blob";

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
        console.log("file",file.name)
        const blobResponse = await axiosInstance.post(
            'api/media/write',
            { fileName: file.name, fileType: file.type , fileExtension: file.name.split('.').pop() },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        console.log("blobResponse",blobResponse)
        if (!blobResponse || !blobResponse.data || !blobResponse.data.presignedUrl || !blobResponse.data.blobName) {
          throw new Error("Invalid response structure from API.");
      }

        const { presignedUrl, blobName } = blobResponse.data;
        console.log("presignedUrl",presignedUrl)
        await uploadBlob(file, blobResponse.data);
        console.log("file uploaded successfully")
        socket.emit("setPfp", { profilePic: blobName });

        console.log("Profile picture updated successfully");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        throw new Error(error.response?.data?.message || "An error occurred while updating the profile picture");
    }
  };
  export const getProfilePic = async () => {
    try
    {
       console.log("getProfilePic called");
        const token = localStorage.getItem("token");
        const userId= whoAmI.id;
        
       //TODO: get blob name from getPfp event of socket
      //  const blobName = await new Promise((resolve, reject) => {
      //   socket.emit("getPfp", { userId });

      //   socket.on("setPfp", (data) => {
      //         if (data && data.profilePic) {
      //             resolve(data.profilePic);
      //         } else {
      //             reject("No profile picture found.");
      //         }
      //     });
      //   setTimeout(() => reject("Timeout waiting for profile picture"), 10000);
      //   }
      // );

        const blobName = "61730487929490.string"
        console.log("blob",blobName)
        if (!blobName) {
          return null;
        }
        
        
        const blobResponse = await axiosInstance.post('api/media/read', {
          blobName: blobName,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },{
          withCredentials: true
        }); 
        console.log("blobResponse",blobResponse)
        const { blob } = await downloadBlob(blobResponse.data);
        const newBlob = new Blob([blob]);
        const objectUrl = URL.createObjectURL(newBlob);
        return objectUrl;

    }
    catch (error)
    {
        console.log(error);
        throw new Error(error.response?.data?.message || "An error occurred");
    }

};
