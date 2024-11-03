import { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosInstance';

const usePost = (url, item) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const addItem = async () => {
      if(item) {
        setLoading(true);
        try {
          const response = await axiosInstance.post(url, item);
          console.log('Response:', response.data);
          setData(response.data);
          setError(null);
        } catch (error) {
          console.error('Error adding item:', error);
          setError(error);
          setData(null);
        } finally {
          setLoading(false);
        }
      }
    }
    addItem();
  }, [url, item])

  return { data, error, loading }
}

export default usePost;