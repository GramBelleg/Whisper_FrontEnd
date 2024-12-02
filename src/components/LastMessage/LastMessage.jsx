import './LastMessage.css'
import TextMessage from '../TextMessage/TextMessage'
import ImageMessage from '../ImageMessage/ImageMessage'
import StickerMessage from '../StickerMessage/StickerMessage'
import VideoMessage from '../VideoMessage/VideoMessage'
import AudioVoiceNoteMessage from '../AudioVoiceNoteMessage/AudioVoiceNoteMessage'
import DeletedMessage from '../DeletedMessage/DeletedMessage' // Fixed typo here
import DraftedMessage from '../DraftedMessage/DraftedMessage'
import { useEffect } from 'react'

const LastMessage = ({ myChat, index }) => {
    useEffect(() => {}, [myChat])
    return (
        <div className='last-message'>
            {myChat.drafted ? (
                <DraftedMessage message={myChat.lastMessage} />
            ) : myChat.messageState === 3 ? (
                <DeletedMessage sender={myChat.senderId} /> // Fixed typo here
            ) : (
                <>
                    {myChat.messageType?.toLowerCase() === 'text'.toLowerCase() && (
                        <TextMessage index={index} message={myChat.lastMessage} />
                    )}
                    {myChat.messageType?.toLowerCase() === 'image'.toLowerCase() && <ImageMessage messageState={myChat.messageState} />}
                    {(myChat.messageType?.toLowerCase() === 'audio'.toLowerCase() ||
                        myChat.messageType.toLowerCase() === 'voiceNote'.toLowerCase()) && (
                        <AudioVoiceNoteMessage
                            messageType={myChat.messageType}
                            messageState={myChat.messageState}
                            message={myChat.lastMessage}
                        />
                    )}
                    {myChat.messageType?.toLowerCase() === 'video'.toLowerCase() && <VideoMessage messageState={myChat.messageState} />}
                    {myChat.messageType?.toLowerCase() === 'sticker'.toLowerCase() && <StickerMessage messageState={myChat.messageState} />}
                </>
            )}
        </div>
    )
}

export default LastMessage
