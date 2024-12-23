const NotificationMessage = ({ notification, type }) => {
  console.log(notification);

  const truncateText = (text, maxLength) =>
      (text && (text.length > maxLength) )? text.slice(0, maxLength) + "..." : text;

  return (
      <div className="flex flex-col text-left">
          <div id="notificationHeader">
              <h3 className="font-bold">{notification.title}</h3>
          </div>
          {type === "reply_message" && (
              <div id="notificationBody" className="italic text-sm text-gray-400">
                  Replied to your message: {truncateText(notification.body, 100)}
              </div>
          )}
          {type === "mention_message" && (
              <div id="notificationBody" className="italic text-sm text-blue-500">
                  Mentioned you: {truncateText(notification.body, 100)}
              </div>
          )}
          {!["reply_message", "mention_message"].includes(type) && (
              <div id="notificationBody">{truncateText(notification.body, 100)}</div>
          )}
      </div>
  );
};

export default NotificationMessage;
