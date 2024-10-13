// This renders sent or recieved stickers
// It is used by the last message


import "./DeletedMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from  '@fortawesome/free-solid-svg-icons';
import { whoAmI } from "../../services/chatservice/chatParams";
import { useEffect, useState } from "react";

const DeltedMessage = ({sender}) => {

    const [user, setUser] = useState("You");

    useEffect(() => {
        if (whoAmI === sender) {
            setUser("You");
        }
        else {
            setUser(sender);   
        }
    },[sender])

    return ( 
        <div className="deleted-message">
            <FontAwesomeIcon icon={faBan} className="deleted-icon"/>
            <span className="deleted-text"> {user} deleted this message</span>
        </div>
    );
}
 
export default DeltedMessage;