// axiosInstance.js
import axios from 'axios';
import { initializeMock } from './mock/mock';
//REACT_APP_API_URL is an .env variable
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

console.log(import.meta.env.VITE_APP_API_URL)

export default axiosInstance;

// no