const apiUrl = import.meta.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_SERVER_URL;

export default apiUrl;