// This is the SVG of the sent tick
// It displays the single tick to be use by chats
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import './SentTicks.css'

const SentTicks = () => {
    return (
        <div className='sent-ticks' data-testid='sent-icon'>
            <FontAwesomeIcon icon={faCheck} className='sent-icon' />
        </div>
    )
}

export default SentTicks
