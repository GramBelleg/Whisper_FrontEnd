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
    const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: blob,
        headers: {
            "x-ms-blob-type": "BlockBlob", 
        },
    });

    if (!uploadResponse.ok) {
        console.log("Error uploading file");
        return null;
    }
    else {
        console.log("file uploaded successfully")
        return { blobName };
    }
}