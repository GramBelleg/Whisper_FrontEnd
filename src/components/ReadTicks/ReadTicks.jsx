// This is the SVG of the sent tick
// It displays the single tick to be use by chats
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import './ReadTicks.css'

const ReadTicks = () => {
    return (
        <div className='read-ticks' data-testid='read-icon' width='100%' height='100%'>
            <FontAwesomeIcon icon={faCheckDouble} className='read-icon' />
        </div>
    )
}

export default ReadTicks
