
import "./ChattingTextMessage.css"
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import { useEffect, useState } from "react";
import PendingSend from "../PendingSend/PendingSend";

const ChattingTextMessage = ({ key, message }) => {

    const [myMessage, setMyMessage] = useState({});

    useEffect(() => {
        setMyMessage(
            (prevMessage) => ({
                ...prevMessage,
                ...message,
                state: mapMessageState(message.state),
            })
        )
        console.log(myMessage)
    }, [message])
    
    return ( 
        <>
            <div key={key} className={`message ${myMessage.sender === 1 ? 'sender shadow' : 'reciever shadow'}`}>
                <div className="message-text">
                    {myMessage.content}
                </div>  
                <div className="message-info">
                    <span className="time">
                        {myMessage.time}
                    </span>
                    {
                        myMessage.sender === 1 && 
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