import React, { useState } from 'react'
import './SelfDestructModal.css'
import { useChat } from '@/contexts/ChatContext'
import { useModal } from '@/contexts/ModalContext'
import { setSelfDestructionTimer } from '@/services/chatservice/setSelfDestructionTimer'

const SelfDestructModal = () => {
    const {currentChat } = useChat()
    const { closeModal } = useModal()
    const [selectedDuration, setSelectedDuration] = useState(currentChat.selfDestruct ? currentChat.selfDestruct : 1)
    const [enable, setEnable] = useState(currentChat.selfDestruct ? true : false)

    const setTimer = async () => {
        let duration = null;
        if (enable) {
            duration = selectedDuration
        }
        await setSelfDestructionTimer(currentChat.id, duration)
        closeModal()
    }

    

    return (
        <div className='self-destructing-modal'>
            <h3 className="text-xl py-3">Set Self-Destruct timer</h3>
            <div className='flex gap-2 self-center'>
                <div className='radio-option'>
                    <input
                        type='radio'
                        id='On'
                        name='mute-duration'
                        value='On'
                        checked={enable}
                        onChange={(e) => {
                            if(e.target.value === 'On') {
                                setEnable(true)
                            }
                        }}
                    />
                    <label htmlFor='On'>On</label>
                </div>
                <div className='radio-option'>
                    <input
                        type='radio'
                        id='OFF'
                        name='mute-duration'
                        value='OFF'
                        checked={!enable}
                        onChange={(e) => {
                            if(e.target.value === 'OFF') {
                                setEnable(false)
                            }  
                        }}
                    />
                    <label htmlFor='OFF'>Off</label>
                </div>
            </div>
            
            {enable && <div className='input-group'>
                <input type="number" className='text-black mr-3 w-24' min={1} max={3600} step={1} value={selectedDuration}  
                    onInput={(e) => {
                        setSelectedDuration(e.target.value)
                    }}
                />
                <span>Seconds</span>
            </div>}
            
            <div className='modal-buttons'>
                <button
                    className='set-button'
                    onClick={() => {
                        setTimer()
                    }}
                >
                    Set
                </button>
                <button className='cancel-button' onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default SelfDestructModal
