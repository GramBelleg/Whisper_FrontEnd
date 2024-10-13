import React, { useEffect, useRef, useState } from "react";
import "./LastMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextMessage from "../TextMessage/TextMessage";
import ImageMessage from "../ImageMessage/ImageMessage";
import StickerMessage from "../StickerMessage/StickerMessage";
import VideoMessage from "../VideoMessage/VideoMessage";
import AudioVoiceNoteMessage from "../AudioVoiceNoteMessage/AudioVoiceNoteMessage";
const LastMessage = ({ messageType, message, messageState,  index }) => {
  

  const renderMessageContent = () => {
    switch (messageType) {
      case "text":
        return (
          <TextMessage index={index} message={message}/>
        );
      case "image":
        return (
          <ImageMessage messageState={messageState}/>
        );
      case "audio":
      case "voiceNote":
        return (
          <AudioVoiceNoteMessage messageType={messageType} messageState={messageState} message={message}/>
        );
      case "video":
        return (
          <VideoMessage messageState={messageState}/>
        );
      case "sticker":
        return (
          <StickerMessage messageState={messageState}/>
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