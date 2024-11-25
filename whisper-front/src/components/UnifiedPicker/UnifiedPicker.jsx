import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { faIcons } from '@fortawesome/free-solid-svg-icons'
import CustomGifPicker from '../CustomGifPicker/CustomGifPicker'
import CustomStickersPicker from '../CustomStickersPicker/CustomStickersPicker'

const UnifiedPicker = ({ onGifSelect, onStickerSelect }) => {
    const [activeTab, setActiveTab] = useState('GIF')
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef(null)

    const togglePicker = () => setShowPicker((prev) => !prev)

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className='relative' ref={pickerRef}>
            <FontAwesomeIcon
                icon={faIcons}
                onClick={togglePicker}
                className='text-primary cursor-pointer text-2xl hover:text-indigo-500 transition-colors'
            />
            {showPicker && (
                <div className='absolute bottom-12 left-0 bg-gray-800 text-white rounded-lg shadow-lg w-80'>
                    <div
                        className={
                            activeTab === 'Stickers' ? 'max-h-96 overflow-y-auto' : ''
                        }
                    >
                        {activeTab === 'GIF' && <CustomGifPicker onGifSelect={onGifSelect} />}
                        {activeTab === 'Stickers' && <CustomStickersPicker handleStickerClick={onStickerSelect} />}
                    </div>
                    <div className='flex justify-center align-center items-center mb-4'>
                        <button
                            className={`flex-1 py-2 mx-2 text-center text-sm rounded-lg ${
                                activeTab === 'GIF' ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveTab('GIF')}
                        >
                            GIF
                        </button>
                        <button
                            className={`flex-1 py-2 mx-2 text-center text-sm rounded-lg ${
                                activeTab === 'Stickers' ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveTab('Stickers')}
                        >
                            <FontAwesomeIcon icon={faNoteSticky} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UnifiedPicker
