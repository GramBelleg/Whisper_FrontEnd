
import "./ChattingTextMessage.css"
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import { useEffect, useMemo, useState } from "react";
import PendingSend from "../PendingSend/PendingSend";
import { whoAmI } from "../../services/chatservice/whoAmI";
import AudioVoiceMessage from "../AudioVoiceMessage/AudioVoiceMessage";
import { messageTypes } from "@/services/sendTypeEnum";

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

    console.log(myMessage)
    const renderMessageContent = useMemo(() => {
        switch (myMessage.type) {
          case messageTypes.TEXT:
            return <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{myMessage.content}</div>;
          case messageTypes.AUDIO:
            return <AudioVoiceMessage audioUrl={myMessage.content} />; // Pass the audio URL to your AudioMessage component
          case messageTypes.IMAGE:
            return <img src={myMessage.content} alt="message" className="message-image" />;
          default:
            return null; // Handle unknown message types
        }
      },[myMessage]);
    
    return ( 
        <>
            <div className={`message shadow ${myMessage.senderId === whoAmI.id ? 'sender ' : 'reciever'}`}>
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