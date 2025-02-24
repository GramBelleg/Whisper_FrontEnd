import { useState, useEffect } from 'react'
import axiosInstance from './axiosInstance' // Import the axios instance

const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(url) // temporarily till real axios.get
            setData(response.data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (url) {
            fetchData()
        }
    }, [url])

    return { data, error, loading, setData, refresh: fetchData }
}

export default useFetch
