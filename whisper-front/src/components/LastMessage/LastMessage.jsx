import "./LastMessage.css";
import TextMessage from "../TextMessage/TextMessage";
import ImageMessage from "../ImageMessage/ImageMessage";
import StickerMessage from "../StickerMessage/StickerMessage";
import VideoMessage from "../VideoMessage/VideoMessage";
import AudioVoiceNoteMessage from "../AudioVoiceNoteMessage/AudioVoiceNoteMessage";
import DeletedMessage from "../DeletedMessage/DeletedMessage"; // Fixed typo here

const LastMessage = ({ sender, messageType, message, messageState, index }) => {

  return (
    <div className="last-message">
      {messageState === 3 ? (
        <DeletedMessage sender={sender}/> // Fixed typo here
      ) : (
        <>
          {messageType.toLowerCase() === "text".toLowerCase() && (
            <TextMessage index={index} message={message}/>
          )}
          {messageType.toLowerCase() === "image".toLowerCase() && (
            <ImageMessage messageState={messageState} />
          )}
          {(messageType.toLowerCase() === "audio".toLowerCase() || messageType.toLowerCase() === "voiceNote".toLowerCase()) && (
            <AudioVoiceNoteMessage
              messageType={messageType}
              messageState={messageState}
              message={message}
            />
          )}
          {messageType.toLowerCase() === "video".toLowerCase() && (
            <VideoMessage messageState={messageState} />
          )}
          {messageType.toLowerCase() === "sticker".toLowerCase() && (
            <StickerMessage messageState={messageState} />
          )}
        </>
      )}
    </div>
  );
};

export default LastMessage;
