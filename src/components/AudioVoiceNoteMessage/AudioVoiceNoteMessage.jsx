// This renders sent or recieved stickers
// It is used by the last message

import './AudioVoiceNoteMessage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'

const AudioVoiceNoteMessage = ({ messageType, messageState, message }) => {
    const [audioDuration, setAudioDuration] = useState(null)
    const audioRef = useRef(null)

    useEffect(() => {
        if (audioRef.current && (messageType === 'audio' || messageType === 'voiceNote')) {
            const handleLoadedMetadata = () => {
                setAudioDuration(audioRef.current.duration.toFixed(1))
            }

            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
                }
            }
        }
    }, [messageType, message])

    return (
        <div className={`${messageType === 'audio' ? 'audio-message' : 'voice-note-message'}`}>
            <audio ref={audioRef} controls className='audio-itself'>
                <source src={message} type='audio/mpeg' />
                Your browser does not support the audio element.
            </audio>

            <FontAwesomeIcon icon={faMicrophone} className={`mic-icon ${messageState === 2 ? 'active' : ''}`} />
            {audioDuration && <span className={`audio-duration ${messageState === 2 ? 'active' : ''}`}>{audioDuration}s</span>}
        </div>
    )
}

export default AudioVoiceNoteMessage
