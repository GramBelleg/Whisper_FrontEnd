const apiUrl = process.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_SERVER_URL;
console.log(apiUrl)
export default apiUrl;