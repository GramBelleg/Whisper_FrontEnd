import './PendingSend.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

const PendingSend = () => {
    return (
        <div className='pending-send-ticks' data-testid='pending-send-icon'>
            <FontAwesomeIcon icon={faClock} className='pending-send-icon' />
        </div>
    )
}

export default PendingSend
