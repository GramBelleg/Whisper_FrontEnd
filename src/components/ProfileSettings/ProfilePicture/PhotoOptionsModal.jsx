import React from 'react'

const PhotoOptionsModal = ({ onClose, onChangePhoto, onRemovePhoto, position }) => {
    return (
        <div
            className='fixed z-50'
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(20%, 60%)'
            }}
        >
            <div className='bg-light p-2 rounded shadow-md relative'>
                <div className='mt-2'>
                    <button className='block w-full text-left p-2 text-primary hover:bg-gray-200' onClick={onChangePhoto} id="change-profile-picture">
                        Change Photo
                    </button>
                    <button className='block w-full text-left p-2 text-red-600 hover:bg-gray-200' onClick={onRemovePhoto} id="remove-profile-picture">
                        Remove Photo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PhotoOptionsModal
