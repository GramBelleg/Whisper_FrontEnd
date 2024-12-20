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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

const LastMessage = ({ myChat }) => {

    useEffect(() => {}, [myChat])
    
    return (
        <div className='last-message'>
            {myChat.draftMessageContent.length > 0 ? (
                <DraftedMessage message={myChat.draftMessageContent} />
            ) : myChat.messageState === 3 ? (
                <DeletedMessage sender={myChat.sender} /> 
            ) : (
                <>
                    
                    {['jpeg', 'jpg', 'svg', 'png'].includes(myChat.attachmentName?.split('.').pop()?.toLowerCase()) && <ImageMessage messageState={myChat.messageState} />}
                    {(myChat.messageType?.toLowerCase() === 'audio'.toLowerCase() ||
                        myChat.messageType?.toLowerCase() === 'voiceNote'.toLowerCase()) && (
                        <AudioVoiceNoteMessage
                            messageType={myChat.messageType}
                            messageState={myChat.messageState}
                            message={myChat.lastMessage}
                        />
                    )}
                    {['mp4', 'wav', 'svk','webm'].includes(myChat.attachmentName?.split('.').pop()?.toLowerCase()) && <VideoMessage messageState={myChat.messageState} />}
                    {myChat.messageType?.toLowerCase() === 'sticker'.toLowerCase() && <StickerMessage messageState={myChat.messageState} />}
                    {myChat.messageType?.toLowerCase() === 'text'.toLowerCase() && (
                        <TextMessage message={myChat.lastMessage} />
                    )}
                    {myChat.messageType?.toLowerCase() === 'call'.toLowerCase() && (<span className='flex gap-2 items-baseline'>
                        <FontAwesomeIcon icon={faPhone} />
                        {myChat.lastMessage}
                    </span>)}
                    {myChat.type == 'DM' && myChat.messageType == null && myChat.participantKeys && (!myChat.participantKeys[0] || !myChat.participantKeys[1]) && (
                            <AwaitingJoinMessage chat={myChat} />
                        )}
                </>
            )}
        </div>
    )
}

export default LastMessage
