export const downloadAttachment = async (presignedUrl, myMessage) => {

    if (presignedUrl) {
      try {
        const response = await fetch(presignedUrl);
        if (!response.ok) {
          throw new Error("Error downloading file");
        }

        const blob = await response.blob();
        console.log(myMessage.extension);
        const finalBlob = new Blob([blob], { type: myMessage.extension });
        const newObjectUrl = URL.createObjectURL(finalBlob);
        return newObjectUrl;

      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };
  