import NoProfile from '@/assets/images/no-profile.svg?react'

const MessageRelationshipsViewer = ({ message }) => {
    if (message.forwarded && message.forwardedFrom) {
        return (
            <div className='flex flex-col mb-2 mr-4 text-sm text-left'>
                <span>Forwarded From</span>
                <div className='flex gap-1 items-center'>
                    {message.forwardedFrom.profilePic ? (
                        <img src={message.forwardedFrom.profilePic} alt='Profile' className='w-4 h-4 rounded-full' />
                    ) : (
                        <NoProfile className='w-4 h-4 rounded-full' />
                    )}
                    <span className='relationship-name'>{message.forwardedFrom.userName}</span>
                </div>
            </div>
        )
    }

    if (message.parentMessage) {
        return (
            <div className='mb-2 hover:bg-opacity-30 cursor-pointer flex flex-col rounded-lg p-1 border-l-4 border-white bg-white bg-opacity-20 text-left'>
                <span className='relationship-text'>{message.parentMessage.senderName}</span>
                <div className='relationship-info'>
                    <span className='relationship-name'>{message.parentMessage.content}</span>
                </div>
            </div>
        )
    }

    return null
}

export default MessageRelationshipsViewer
