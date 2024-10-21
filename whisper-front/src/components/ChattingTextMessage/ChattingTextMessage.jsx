
import "./ChattingTextMessage.css"
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import { useEffect, useMemo, useState } from "react";
import PendingSend from "../PendingSend/PendingSend";
import { whoAmI } from "../../services/chatservice/whoAmI";
import AudioVoiceMessage from "../AudioVoiceMessage/AudioVoiceMessage";

const ChattingTextMessage = ({ message }) => {

    const [myMessage, setMyMessage] = useState({});

    useEffect(() => {
        setMyMessage(
            (prevMessage) => ({
                ...prevMessage,
                ...message,
                state: mapMessageState(message.state),
            }),
        )
    }, [message])

    const renderMessageContent = useMemo(() => {
        switch (myMessage.type) {
          case 'text':
            return <div className="message-text">{myMessage.content}</div>;
          case 'audio':
            return <AudioVoiceMessage audioUrl={myMessage.content} />; // Pass the audio URL to your AudioMessage component
          case 'image':
            return <img src={myMessage.content} alt="message" className="message-image" />;
          default:
            return null; // Handle unknown message types
        }
      },[myMessage]);
    
    return ( 
        <>
            <div className={`message shadow ${myMessage.sender === 1 ? 'sender ' : 'reciever'}`}>
                {renderMessageContent} 
                <div className="message-info">
                    <span className="time">
                        {myMessage.time}
                    </span>
                    {
                        myMessage.senderId === whoAmI.id && 
                        <span className='message-status'>
                        { 
                            myMessage.state === 0  && (
                                <SentTicks width='12px'/>
                            ) 
                            || 
                            myMessage.state === 1 && (
                                <DeliveredTicks width='12px'/>
                            )
                            || 
                            myMessage.state === 2 && (
                                <ReadTicks width='12px'/>
                            )
                            || 
                            myMessage.state === 4 && (
                                <PendingSend width='12px'/>
                            )
                        } 
                        </span>
                    }
                    
                </div>
            </div>
        </>
    );
}
 
export default ChattingTextMessage;