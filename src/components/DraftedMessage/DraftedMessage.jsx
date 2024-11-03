// This component is use by LastMessage to show that a message sent was a draft

import "./DraftedMessage.css";

const DraftedMessage = ({ message }) => {
    const maxLength = 42; // Set the maximum number of characters to display

    const trimmedMessage = message.length > maxLength
        ? `${message.slice(0, maxLength - 3)}...`
        : message;

    return ( 
        <div className="drafted-message">
            <span className="draft">
                Draft: 
            </span>
            <span className="message-draft">
                {trimmedMessage}
            </span>
        </div>
    );
}

export default DraftedMessage;
