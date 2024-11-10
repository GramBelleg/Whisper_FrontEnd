import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmojiPicker from 'emoji-picker-react'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import './CustomEmojisPicker.css'

const CustomEmojisPicker = ({ handleEmojiClick }) => {
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef(null)

    const togglePicker = () => {
        setShowPicker((prevState) => !prevState)
    }

    const hidePickerOnEsc = (event) => {
        if (event.key === 'Escape') {
            setShowPicker(false)
        }
    }

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

    const showPickerIconStyle = `${showPicker ? 'active' : ''} emojis-picker-icon`

    return (
        <div className='emojis-picker-container' onKeyDown={hidePickerOnEsc} ref={pickerRef}>
            <FontAwesomeIcon icon={faSmile} onClick={togglePicker} className={showPickerIconStyle} />
            {showPicker && (
                <div className='emojis-picker'>
                    <EmojiPicker width={350} height={420} theme='dark' onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    )
}

CustomEmojisPicker.propTypes = {
    handleEmojiClick: PropTypes.func.isRequired
}

export default CustomEmojisPicker
