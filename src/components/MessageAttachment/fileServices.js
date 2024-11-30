export const downloadAttachment = async (downloadData, myMessage) => {

    if (downloadData) {
      try {
        const presignedUrl = downloadData.presignedUrl;
        const response = await fetch(presignedUrl);
        if (!response.ok) {
          throw new Error("Error downloading file");
        }

        const blob = await response.blob();
        const finalBlob = new Blob([blob], { type: myMessage.file.type });
        const newObjectUrl = URL.createObjectURL(finalBlob);
        return newObjectUrl;

      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };
  