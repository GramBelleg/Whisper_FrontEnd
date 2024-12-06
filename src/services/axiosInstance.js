import apiUrl from '@/config'
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
})

export default axiosInstance
