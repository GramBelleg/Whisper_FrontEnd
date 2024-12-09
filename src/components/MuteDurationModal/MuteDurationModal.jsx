import React, { useState } from 'react'
import './MuteDurationModal.css'

const MuteDurationModal = ({ onClose, setMuteDuration, setClicked }) => {
    const handleOutsideClick = (event) => {
        if (event.target.className === 'modal-overlay') {
            onClose()
        }
    }

    const [selectedDuration, setSelectedDuration] = useState(null)

    return (
        <div className='modal-overlay' onClick={handleOutsideClick}>
            <div className='mute-duration-modal'>
                <h3>Choose Mute Duration</h3>
                <div className='radio-option'>
                    <input
                        type='radio'
                        id='24-hours'
                        name='mute-duration'
                        value='24 hours'
                        checked={selectedDuration === 24}
                        onChange={(e) => {
                            setMuteDuration(24)
                            setSelectedDuration(24)
                        }}
                    />
                    <label htmlFor='24-hours'>24 Hours</label>
                </div>
                <div className='radio-option'>
                    <input
                        type='radio'
                        id='8-hours'
                        name='mute-duration'
                        value='8 hours'
                        checked={selectedDuration === 8}
                        onChange={(e) => {
                            setMuteDuration(8)
                            setSelectedDuration(8)
                        }}
                    />
                    <label htmlFor='8-hours'>8 Hours</label>
                </div>
                <div className='radio-option'>
                    <input
                        type='radio'
                        id='1-month'
                        name='mute-duration'
                        value='1 month'
                        checked={selectedDuration === 1}
                        onChange={(e) => {
                            setMuteDuration(1)
                            setSelectedDuration(1)
                        }}
                    />
                    <label htmlFor='1-month'>1 Month</label>
                </div>
                <div className='modal-buttons'>
                    <button
                        className='mute-button'
                        onClick={() => {
                            setClicked(true)
                            onClose()
                        }}
                    >
                        Mute
                    </button>
                    <button className='cancel-button' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MuteDurationModal
