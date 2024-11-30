// This component display the image message 
// It is used by LastMessage

import "./ImageMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from  '@fortawesome/free-solid-svg-icons';


const ImageMessage = ({messageState}) => {
    return ( 
        <div className="image-message">
            <FontAwesomeIcon icon={faCamera} className={`image-icon ${messageState === 2  ? 'active' : ''}`} />
            <span className={`image-text ${messageState === 2  ? 'active' : ''}`}>Image</span>
        </div>
    );
}
 
export default ImageMessage;