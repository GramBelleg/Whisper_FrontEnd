const NotificationMessage = ({ notification }) => {
  console.log(notification)
    return (
      <>
        <div id="notificationHeader">
          <h3 className="font-bold">{notification.title}:</h3>
        </div>
        <div id="notificationBody">{notification.body}</div>
      </>
    );
  };
  
  export default NotificationMessage;