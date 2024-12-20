
import './DraftedMessage.css'

const DraftedMessage = ({ message }) => {
    const maxLength = 42 

    const trimmedMessage = message.length > maxLength ? `${message.slice(0, maxLength - 3)}...` : message

    return (
        <div className='drafted-message'>
            <span className='draft'>Draft:</span>
            <span className='message-draft'>{trimmedMessage}</span>
        </div>
    )
}

export default DraftedMessage
