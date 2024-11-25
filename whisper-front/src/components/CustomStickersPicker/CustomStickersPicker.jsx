import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { getBlobUrl } from '@/services/blobs/blob'

const CustomStickersPicker = ({ handleStickerClick }) => {
    const [stickers, setStickers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStickers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stickers', {
                    withCredentials: true
                })

                const blobNames = response.data.stickers

                const fetchedStickers = await Promise.all(
                    blobNames.map(async (blobName) => {
                        const { imageUrl, error } = await getBlobUrl(blobName)
                        if (imageUrl) {
                            return imageUrl
                        } else {
                            console.error(`Error fetching sticker for ${blobName}:`, error)
                            return null
                        }
                    })
                )

                setStickers(fetchedStickers.filter(Boolean))
                setStickers([
                    'https://cdn-icons-png.flaticon.com/512/616/616489.png',
                    'https://cdn-icons-png.flaticon.com/512/742/742751.png',
                    'https://cdn-icons-png.flaticon.com/512/845/845646.png',
                    'https://cdn-icons-png.flaticon.com/512/953/953930.png',
                    'https://cdn-icons-png.flaticon.com/512/1303/1303064.png',
                    'https://cdn-icons-png.flaticon.com/512/984/984196.png',
                    'https://cdn-icons-png.flaticon.com/512/1048/1048952.png',
                    'https://cdn-icons-png.flaticon.com/512/906/906349.png',
                    'https://cdn-icons-png.flaticon.com/512/435/435060.png',
                    'https://cdn-icons-png.flaticon.com/512/3610/3610866.png',
                    'https://cdn-icons-png.flaticon.com/512/616/616489.png',
                    'https://cdn-icons-png.flaticon.com/512/742/742751.png',
                    'https://cdn-icons-png.flaticon.com/512/845/845646.png',
                    'https://cdn-icons-png.flaticon.com/512/953/953930.png',
                    'https://cdn-icons-png.flaticon.com/512/1303/1303064.png',
                    'https://cdn-icons-png.flaticon.com/512/984/984196.png',
                    'https://cdn-icons-png.flaticon.com/512/1048/1048952.png',
                    'https://cdn-icons-png.flaticon.com/512/906/906349.png',
                    'https://cdn-icons-png.flaticon.com/512/435/435060.png',
                    'https://cdn-icons-png.flaticon.com/512/3610/3610866.png'
                ])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching stickers:', error)
                setLoading(false)
            }
        }

        fetchStickers()
    }, [])

    return (
        <div className='p-2'>
            {loading ? (
                <p className='text-gray-400 text-center'>Loading stickers...</p>
            ) : stickers.length > 0 ? (
                <div className='grid grid-cols-3 p-4 gap-4'>
                    {stickers.map((stickerUrl, index) => (
                        <img
                            key={index}
                            src={stickerUrl}
                            alt={`Sticker ${index + 1}`}
                            className='w-16 h-16 rounded-lg cursor-pointer hover:scale-105 transform transition'
                            onClick={() => handleStickerClick(stickerUrl)}
                        />
                    ))}
                </div>
            ) : (
                <p className='text-gray-400 text-center'>No stickers available</p>
            )}
        </div>
    )
}

CustomStickersPicker.propTypes = {
    handleStickerClick: PropTypes.func.isRequired
}

export default CustomStickersPicker
