
import "./ChattingTextMessage.css"
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import { mapMessageState } from "../../services/chatservice/mapMessageState";
import { useEffect, useState } from "react";

const ChattingTextMessage = ({ key, message }) => {
    /*
        <div className='message sender shadow'>
            <div className='message-text'>
                I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of
                Stavanger. Have you been to this city?
            </div>
            <div className='message-info'>
                <span className='time'>12:51</span>
                <span className='message-status'>
                    <SentTicks width='12px' />
                </span>
            </div>
        </div>

        <div className='message receiver shadow'>
            <div className='message-text'>
                I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of
                Stavanger. Have you been to this city?
            </div>
            <div className='message-info'>
                <span className='time'>12:51</span>
            </div>
        </div>
    */
    /*
        {
            content: "I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?",
            chatId: 3,
            type: "text",
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            sender: 1
        }
    */
    const [myMessage, setMyMessage] = useState({})
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
                            <ReadTicks  width='12px'/>
                        )
                        
                    } 
                    </span>
                </div>
            </div>
        </>
    );
}
 
export default ChattingTextMessage;