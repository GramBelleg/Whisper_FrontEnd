import axios from 'axios'
import { getBlobUrl, uploadBlob } from '../blobs/blob'
import axiosInstance from '../axiosInstance'
import apiUrl from '@/config'

export const getStickers = async () => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/api/stickers`, {
            withCredentials: true
        })

        const blobNames = response.data.stickers

        console.log(blobNames)

        const fetchedStickers = await Promise.all(
            blobNames.map(async (blobName) => {
                try {
                    const { blob, imageUrl, error } = await getBlobUrl(blobName.blobName)

                    if (error) {
                        console.error(`Skipping sticker for ${blobName} due to error: ${error}`)
                        return null
                    }

                    const file = new File([blob], blobName, { type: 'image/sticker' })

                    return { blobName, imageUrl, file }
                } catch (error) {
                    console.error(`Error fetching sticker for ${blobName}:`, error)
                    return null
                }
            })
        )

        return fetchedStickers.filter(Boolean)
    } catch (error) {
        console.error('Error fetching stickers:', error)
        return []
    }
}

export const addStickers = async (file) => {
    try {
        console.log(file)
        const blobResponse = await axios.post(
            `${apiUrl}/api/media/write`,
            {
                fileName: file.name,
                fileType: file.type,
                fileExtension: file.name.split('.').pop()
            },
            {
                withCredentials: true
            }
        )
        console.log(blobResponse)
        if (!blobResponse || !blobResponse.data || !blobResponse.data.presignedUrl || !blobResponse.data.blobName) {
            throw new Error('Invalid response structure from API.')
        }

        const { presignedUrl, blobName } = blobResponse.data

        await uploadBlob(file, { presignedUrl: presignedUrl, blobName })

        const stickerData = {
            sticker: {
              blobName: blobName
            }
          };

        const response = await axiosInstance.post(`${apiUrl}/api/stickers/add`,stickerData, {
            withCredentials: true
        })

        console.log(response)

        return blobName
    } catch (error) {
        console.error('Error fetching stickers:', error)
        return []
    }
}
