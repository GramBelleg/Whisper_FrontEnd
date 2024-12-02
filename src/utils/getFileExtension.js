export const getFileExtension = (fileName) => {
    if (fileName.includes('.')) {
        return fileName.split('.').pop().toLowerCase();
      } else {
       return null;
      }
};
