import { useEffect, useState } from 'react';
import './SingleChatSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons';
import SentTicks from '../SentTicks/SentTicks';
import DeliveredTicks from '../DeliveredTicks/DeliveredTicks';
import ReadTicks from '../ReadTicks/ReadTicks';

const SingleChatSection = ({selectedUser}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userDetails, setUserDetails] = useState({
        id: 1,
        name: "John Doe",
        last_seen_at: "10:00:50",
    });

    
    useEffect(() => {
        // simpulate fetching chat data

        setMessages([
            {
                id: 1,
                sender: "John Doe",
                message: "Hello",
                datetime: "2024-10-13 10:00:50",
            },
            {
                id: 2,
                sender: "John Doe",
                message: "How are you?",
                datetime: "2024-10-05 10:00:51",
            },
            {
                id: 3,
                sender: "John Doe",
                message: "I am fine",
                datetime: "2024-10-13 10:00:52",
            },
        ]);

        setUserDetails({
            id: 1,
            name: "John Doe",
            profile_pic: "./assets/images/Grambell.png",
            last_seen_at: "10:00:50",
        });
    }, []);
    return (
        <div className="single-chat-container">
            <div className="single-chat-header shadow-md">
                <div className="header-avatar">
                    <img src={userDetails.profile_pic} alt={userDetails.name} />
                </div>
                <div className="header-details">
                    <span className='header-title'>{userDetails.name}</span>
                    <span className='header-subtitle'>Last seen at {userDetails.last_seen_at}</span>
                </div>
                <div className='header-icons'>
                    <FontAwesomeIcon className='icon' icon={faSearch} />
                    <FontAwesomeIcon className='icon' icon={faPhone} />
                    <FontAwesomeIcon className='icon' icon={faEllipsisV} />
                </div>
            </div>
            <div className="messages">
                <div className="message sender shadow">
                    <div className="message-text">
                    I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?
                    </div>
                    <div className="message-info">
                        <span className='time'>
                            12:51
                        </span>
                        <span className='message-status'>
                            <SentTicks width="12px" />
                        </span>
                    </div>
                </div>

                <div className="message receiver shadow">
                    <div className="message-text">
                    I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?
                    </div>
                    <div className="message-info">
                        <span className='time'>
                            12:51
                        </span>
                    </div>
                </div>

            </div>
            
            <div className="chat-actions-container">
                <input type="text" className="single-chat-input-box" placeholder="Type a message"/>
            </div>
        </div>
    );
}
 
export default SingleChatSection;