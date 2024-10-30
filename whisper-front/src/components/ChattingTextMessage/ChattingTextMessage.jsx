import { useEffect, useMemo, useState } from "react";
import "./ChattingTextMessage.css";
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import PendingSend from "../PendingSend/PendingSend";
import { whoAmI } from "../../services/chatservice/whoAmI";
import AudioVoiceMessage from "../AudioVoiceMessage/AudioVoiceMessage";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import MessageAttachmentRenderer from '../MessageAttachment/MessageAttachmentRenderer';

const ChattingTextMessage = ({ message }) => {
  const [myMessage, setMyMessage] = useState(message || {});

  useEffect(() => {
    if (message) {
      setMyMessage({
        ...message,
        state: mapMessageState(message.state),
      });
    }
  }, [message]);

  const updateObjectLink = (objectLink) => {
    setMyMessage(prev => ({
      ...prev,
      objectLink,
    }));
    if (message) {
        message.objectLink = objectLink;
    }
    console.log(message);
  };

  const renderMessageContent = useMemo(() => {
    if (!myMessage?.type) {
      console.log("Message type missing:", myMessage);
      return null;
    }

    const type = myMessage.type.toLowerCase();
    const content = myMessage.content;

    if (!content) {
      console.log("Message content missing:", myMessage);
      return null;
    }

    switch (type) {
      case 'text':
        return (
          <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
            {myMessage.file && <MessageAttachmentRenderer myMessage={myMessage}  onUpdateLink={updateObjectLink}  />}
            {content}
        </div>  
        );
      case 'audio':
        return <AudioVoiceMessage audioUrl={content} />;
      case 'image':
        return <img src={content} alt="message" className="message-image" />;
      default:
        console.log("Unknown message type:", type);
        return null;
    }
  }, [myMessage]);

  // Don't render if we don't have a valid message
  if (!myMessage || !myMessage.type || !myMessage.content) {
    return null;
  }

  return (
    <div className={`message shadow ${myMessage.senderId === whoAmI.id ? 'sender' : 'reciever'}`}>
      {renderMessageContent}
      <div className="message-info">
        <span className="time">
          {myMessage.time}
        </span>
        {myMessage.senderId === whoAmI.id && (
          <span className="message-status">
            {myMessage.state === 0 && <SentTicks width="12px" />}
            {myMessage.state === 1 && <DeliveredTicks width="12px" />}
            {myMessage.state === 2 && <ReadTicks width="12px" />}
            {myMessage.state === 4 && <PendingSend width="12px" />}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChattingTextMessage;
    