const apiUrl = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_SERVER_URL;
console.log("Api url", apiUrl)
export default apiUrl;