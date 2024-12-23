import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { addStickers, getStickers } from '@/services/chatservice/getStickers'

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
    }, [stickers])

    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        console.log(file)
        if (file) {
            try {
                const blobName = await addStickers(file)
                setStickers([...stickers,blobName])
            } catch (error) {
                console.log("error adding stickers")
            }
        }
    }

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

            {/* Add Sticker Button - Positioned at Top Right */}
            <div className='absolute top-2 right-2'>
                <label htmlFor='sticker-upload' className='cursor-pointer text-primary text-lg hover:text-highlight transition m-2'>
                    <span className='text-3xl'>+</span>
                </label>
                <input
                    type='file'
                    id='sticker-upload'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}

CustomStickersPicker.propTypes = {
    handleStickerClick: PropTypes.func.isRequired,
}

export default CustomStickersPicker
