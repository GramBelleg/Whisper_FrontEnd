import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getStickers } from '@/services/chatservice/getStickers'

const CustomStickersPicker = ({ handleStickerClick }) => {
    const [stickers, setStickers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStickers = async () => {
            try {
                const fetchedStickers = await getStickers()
                setStickers(fetchedStickers)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching stickers:', error)
                setLoading(false)
            }
        }

        fetchStickers()
    }, [])

    return (
        <div className='p-2' id='stickers-picker' data-testid='stickers-picker'>
            {loading ? (
                <p className='text-gray-400 text-center'>Loading stickers...</p>
            ) : stickers.length > 0 ? (
                <div className='grid grid-cols-3 p-4 gap-4'>
                    {stickers.map((sticker, index) => (
                        <img
                            key={index}
                            id={sticker.blobName}
                            data-testid={`sticker-${sticker.blobName}`}
                            src={sticker.imageUrl}
                            alt={`Sticker ${index + 1}`}
                            className='w-16 h-16 rounded-lg cursor-pointer hover:scale-105 transform transition'
                            onClick={() => handleStickerClick(sticker.blobName, sticker.imageUrl, sticker.file)}
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
