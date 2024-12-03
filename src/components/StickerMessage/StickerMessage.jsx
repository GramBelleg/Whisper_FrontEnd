// This renders sent or recieved stickers
// It is used by the last message

import './StickerMessage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

const StickerMessage = ({ messageState }) => {
    return (
        <div className='sticker-message'>
            <FontAwesomeIcon icon={faNoteSticky} className={`sticker-icon ${messageState === 2 ? 'active' : ''}`} />
            <span className={`sticker-text ${messageState === 2 ? 'active' : ''}`}>Sticker</span>
        </div>
    )
}

export default StickerMessage
