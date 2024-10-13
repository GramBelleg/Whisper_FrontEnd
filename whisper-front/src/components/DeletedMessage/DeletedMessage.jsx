// This renders sent or recieved stickers
// It is used by the last message


import "./DeletedMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from  '@fortawesome/free-solid-svg-icons';

const DeltedMessage = () => {
    return ( 
        <div className="deleted-message">
            <FontAwesomeIcon icon={faBan} className="deleted-icon"/>
            <span className="deleted-text">You deleted this message</span>
        </div>
    );
}
 
export default DeltedMessage;