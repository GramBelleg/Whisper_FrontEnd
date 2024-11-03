// This renders sent or recieved stickers
// It is used by the last message


import "./VideoMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from  '@fortawesome/free-solid-svg-icons';

const VideoMessage = ({messageState}) => {
    return ( 
        <div className="video-message">
            <FontAwesomeIcon icon={faVideo} className={`video-icon ${messageState === 2  ? 'active' : ''}`} />
            <span className={`video-text ${messageState === 2  ? 'active' : ''}`}>Video</span>
        </div>
    );
}
 
export default VideoMessage;