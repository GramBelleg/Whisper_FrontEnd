import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './ErrorMessage.css'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const ErrorMesssage = ({ errorMessage, onClose, appearFor }) => {
    setTimeout(() => {
        onClose()
    }, appearFor)

    return (
        <div className='error-message'>
            <FontAwesomeIcon icon={faCircleExclamation} className='fa-error' />
            {errorMessage}
        </div>
    )
}

export default ErrorMesssage
