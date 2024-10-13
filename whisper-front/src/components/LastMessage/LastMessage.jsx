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
          {messageType === "text" && (
            <TextMessage index={index} message={message} />
          )}
          {messageType === "image" && (
            <ImageMessage messageState={messageState} />
          )}
          {(messageType === "audio" || messageType === "voiceNote") && (
            <AudioVoiceNoteMessage
              messageType={messageType}
              messageState={messageState}
              message={message}
            />
          )}
          {messageType === "video" && (
            <VideoMessage messageState={messageState} />
          )}
          {messageType === "sticker" && (
            <StickerMessage messageState={messageState} />
          )}
        </>
      )}
    </div>
  );
};

export default LastMessage;
