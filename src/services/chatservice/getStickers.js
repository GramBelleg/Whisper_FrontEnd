import axios from "axios"
import { getBlobUrl } from "../blobs/blob"
import axiosInstance from "../axiosInstance";

export const getStickers = async () => {
    try {
        const response = await axiosInstance.post('/api/stickers', {
            withCredentials: true
        });

        const blobNames = response.data.stickers;

        const fetchedStickers = await Promise.all(
            blobNames.map(async (blobName) => {
                try {
                    const { imageUrl } = await getBlobUrl(blobName);
                    return {blobName,imageUrl};
                } catch (error) {
                    console.error(`Error fetching sticker for ${blobName}:`, error);
                    return null;
                }
            })
        );

        return fetchedStickers.filter(Boolean);
    } catch (error) {
        console.error('Error fetching stickers:', error);
        return [];
    }
};
