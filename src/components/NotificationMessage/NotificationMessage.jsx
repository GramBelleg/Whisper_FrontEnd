const NotificationMessage = ({ notification }) => {
    console.log(notification)
    const truncateText = (text, maxLength) => (text.length > maxLength ? text.slice(0, maxLength) + '...' : text)
    return (
        <div className='flex flex-col text-left'>
            <div id='notificationHeader'>
                <h3 className='font-bold'>{notification.title}</h3>
            </div>
            <div id='notificationBody'>{truncateText(notification.body, 100)}</div>
        </div>
    )
}

export default NotificationMessage
