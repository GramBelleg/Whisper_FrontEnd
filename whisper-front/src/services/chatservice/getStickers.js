import axios from "axios"
import { getBlobUrl } from "../blobs/blob"

export const getStickers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/stickers', {
            withCredentials: true
        });

        const blobNames = response.data.stickers;

        const fetchedStickers = await Promise.all(
            blobNames.map(async (blobName) => {
                try {
                    const { blob, imageUrl } = await getBlobUrl(blobName);
                    return imageUrl;
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
