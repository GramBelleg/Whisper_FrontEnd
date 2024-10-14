import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmojiPicker from 'emoji-picker-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import './CustomEmojisPicker.css'

const CustomEmojisPicker = ({ handleEmojiClick }) => {
    const [showPicker, setShowPicker] = useState(false)

    const togglePicker = () => {
        setShowPicker((prevState) => !prevState)
    }

    const hidePickerOnEsc = (event) => {
        if (event.key === 'Escape') {
            setShowPicker(false)
        }
    }

    const showPickerIconStyle = `${showPicker ? 'active' : ''} emojis-picker-icon`

    return (
        <div className='emojis-picker-container' onKeyDown={hidePickerOnEsc}>
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
