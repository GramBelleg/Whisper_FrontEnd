import "./UnRead.css";

const UnRead = ({ unReadMessages, tag }) => {
    // Check if unread messages exceed 99, display "99+" if true
    const displayMessages = unReadMessages > 99 ? "99+" : unReadMessages;

    return ( 
        <div className="unread">
            {tag ? (
                <span className="unread-at">@</span>
            ) : (
                unReadMessages > 0 && (
                    <span className="unread-count">{displayMessages}</span>
                )
            )}
        </div>
    );
}
 
export default UnRead;
