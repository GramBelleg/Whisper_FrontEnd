import axiosInstance from '../axiosInstance'

export const uploadMedia = async (fileData) => {
    try {
        const uploadCredentials = await axiosInstance.post(
            '/api/media/write',
            {
                fileExtension: fileData.extension
            },
            { withCredentials: true }
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
        const downloadData = await axiosInstance.post('/api/media/read', { blobName }, { withCredentials: true })
        console.log(blobName, ' ', downloadData)
        return downloadData.data.presignedUrl
    } catch (err) {
        console.error('Download error:', err)
    }
}
