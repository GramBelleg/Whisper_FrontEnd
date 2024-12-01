import axiosInstance from "../axiosInstance";

// get the data from the url
const getDownloadData =  async () => {

    let error = '';
    let data = null;

    try {
        const response = await axiosInstance.get("/downloadBlob");
        data = response.data;
        error = null;
        
    } catch (err) {
        error = err;
    }

    return { data , error };
}

export const downloadBlob = async (downloadData) => {
    console.log("Downloading blob:", downloadData);

    let error = '';
    let blob = '';

    if (downloadData) {
        try {
            const presignedUrl = downloadData.presignedUrl;
            const response = await fetch(presignedUrl);

            if (!response.ok) {
                throw new Error("Error downloading file");
            }

            blob = await response.blob();
        } 
        catch (err) {
            error = err;
            console.error("Download error:", error);
        }
    } 
    else {
        error = new Error("No download data provided");
        console.error("Download error:", error);
    }

    return { blob, error};
};

export const uploadBlob = async (file, data) => {
    let presignedUrl = data.presignedUrl;
    let blobName = data.blobName;
    let blob = new Blob([file]);
    try {
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: blob,
            headers: {
                "x-ms-blob-type": "BlockBlob", 
            },
        });
        console.log("file uploaded successfully")
        return { blobName };
    } catch (err) {
        console.error("Upload error:", err);
        throw err;
    }

}

export const getBlobUrl = async (blobName) => {
    let error = '';
    let imageUrl = '';
    let blob = '';

    if (blobName) {
        try {
            const response = await axiosInstance.post(`/api/media/read`, {
                blobName ,
            });

            if (response.status !== 200 || !response.data.presignedUrl) {
                throw new Error("Error fetching presigned URL");
            }
            const presignedUrl = response.data.presignedUrl;
            const blobResponse = await fetch(presignedUrl);
            if (!blobResponse.ok) {
                throw new Error("Error fetching blob");
            }

            blob = await blobResponse.blob();

            imageUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = err;
            console.error("Error getting blob URL:", error);
        }
    } else {
        error = new Error("No blob name provided");
        console.error("Error:", error);
    }

    return { blob, imageUrl, error };
};
