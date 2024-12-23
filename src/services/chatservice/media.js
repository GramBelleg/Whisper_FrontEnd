import apiUrl from '@/config'
import axiosInstance from '../axiosInstance'
import axios from 'axios'

export const uploadMedia = async (fileData) => {
    try {
        const token = localStorage.getItem("token")
        const uploadCredentials = await axios.post(
            `${apiUrl}/api/media/write`,
            {
                fileExtension: fileData.extension
            },
            { headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true }
        )

        const { presignedUrl, blobName } = uploadCredentials.data

        const blob = new Blob([fileData.file])
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: blob,
            headers: {
                'x-ms-blob-type': 'BlockBlob'
            }
        })

        if (!uploadResponse.ok) {
            console.log('Error uploading file')
            return null
        }

        return blobName
    } catch (err) {
        console.error('Upload error:', err)
    }
}

export const readMedia = async (blobName) => {
    try {
        const token = localStorage.getItem("token")
        const downloadData = await axios.post(`${apiUrl}/api/media/read`, { blobName }, { 
            headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        console.log(blobName, ' ', downloadData)
        return downloadData.data.presignedUrl
    } catch (err) {
        console.error('Download error:', err)
    }
}
