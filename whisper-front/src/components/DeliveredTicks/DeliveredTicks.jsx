// This is the SVG of the sent tick
// It displays the single tick to be use by chats
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import "./DeliveredTicks.css"

const SentTicks = () => {
    return ( 
        <div className="delivered-ticks">
            <FontAwesomeIcon icon={faCheckDouble} className="delivered-icon"/>
        </div>
    );
}

export default SentTicks
