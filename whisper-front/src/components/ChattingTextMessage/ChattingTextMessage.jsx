
import "./ChattingTextMessage.css"
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import { useEffect, useState } from "react";
import PendingSend from "../PendingSend/PendingSend";
import { whoAmI } from "../../services/chatservice/whoAmI";

const ChattingTextMessage = ({ key, message }) => {

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

    console.log(myMessage.state);
    return ( 
        <>
            <div key={key} className={`message ${myMessage.senderId === whoAmI.id ? 'sender shadow' : 'reciever shadow'}`}>
                <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                    {myMessage.content}
                </div>  
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