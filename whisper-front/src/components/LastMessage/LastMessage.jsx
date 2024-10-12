import React, { useEffect, useRef, useState } from "react";
import "./LastMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from  '@fortawesome/free-solid-svg-icons';
const LastMessage = ({ messageType, message, messageState,  index }) => {
  const [audioDuration, setAudioDuration] = useState(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const textRef = useRef(null);
  const audioRef = useRef(null);
console.log(messageState)
  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current) {
        const { scrollWidth, clientWidth } = textRef.current;
        setIsTextOverflowing(scrollWidth > clientWidth);
      }
    };

    checkTextOverflow();
    window.addEventListener("resize", checkTextOverflow);

    
    if (audioRef.current && (messageType === "audio" || messageType === "voiceNote")) {
      const handleLoadedMetadata = () => {
        setAudioDuration(audioRef.current.duration.toFixed(1));
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        window.removeEventListener("resize", checkTextOverflow);
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [messageType, message]);

  const renderMessageContent = () => {
    switch (messageType) {
      case "text":
        return (
          <p ref={textRef} className={`text-message ${isTextOverflowing ? 'overflow' : ''} ${index ? 'hovered' : ''}`}>
            {message}
          </p>
        );
      case "image":
        return <img src={message} alt="Image" className="message-image" />;
      case "audio":
      case "voiceNote":
        return (
          <div className={`${messageType === "audio" ? "audio-message" : "voice-note-message"}`}>
            <audio ref={audioRef} controls className="audio-itself">
              <source src={message} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <FontAwesomeIcon icon={faMicrophone} className={`mic-icon ${messageState === 0  ? '' : 'active'}`} />
            {audioDuration && <span className={`audio-duration ${messageState === 0  ? '' : 'active'}`}>{audioDuration}s</span>}
          </div>
        );
      case "video":
        return (
          <video controls className="message-video">
            <source src={message} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className="last-message">
      {renderMessageContent()}
    </div>
  );
};

export default LastMessage;