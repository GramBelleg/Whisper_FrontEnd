import './LastMessage.css'
import TextMessage from '../TextMessage/TextMessage'
import ImageMessage from '../ImageMessage/ImageMessage'
import StickerMessage from '../StickerMessage/StickerMessage'
import VideoMessage from '../VideoMessage/VideoMessage'
import AudioVoiceNoteMessage from '../AudioVoiceNoteMessage/AudioVoiceNoteMessage'
import DeletedMessage from '../DeletedMessage/DeletedMessage' 
import DraftedMessage from '../DraftedMessage/DraftedMessage'
import { useEffect } from 'react'
import AwaitingJoinMessage from '../AwaitingJoinMessage/AwaitingJoinMessage'

const LastMessage = ({ myChat }) => {

    useEffect(() => {}, [myChat])
    
    return (
        <div className='last-message'>
            {myChat.drafted ? (
                <DraftedMessage message={myChat.lastMessage} />
            ) : myChat.messageState === 3 ? (
                <DeletedMessage sender={myChat.sender} /> 
            ) : (
                <>
                    {myChat.messageType?.toLowerCase() === 'text'.toLowerCase() && (
                        <TextMessage message={myChat.lastMessage} />
                    )}
                    {myChat.messageType?.toLowerCase() === 'image'.toLowerCase() && <ImageMessage messageState={myChat.messageState} />}
                    {(myChat.messageType?.toLowerCase() === 'audio'.toLowerCase() ||
                        myChat.messageType?.toLowerCase() === 'voiceNote'.toLowerCase()) && (
                        <AudioVoiceNoteMessage
                            messageType={myChat.messageType}
                            messageState={myChat.messageState}
                            message={myChat.lastMessage}
                        />
                    )}
                    {myChat.messageType?.toLowerCase() === 'video'.toLowerCase() && <VideoMessage messageState={myChat.messageState} />}
                    {myChat.messageType?.toLowerCase() === 'sticker'.toLowerCase() && <StickerMessage messageState={myChat.messageState} />}
                    {myChat.type == 'DM' && myChat.participantKeys && (!myChat.participantKeys[0] || !myChat.participantKeys[1]) && (
                            <AwaitingJoinMessage chat={myChat} />
                        )}
                </>
            )}
        </div>
    )
}

export default LastMessage
