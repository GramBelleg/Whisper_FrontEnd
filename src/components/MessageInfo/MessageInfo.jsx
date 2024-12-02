import { useEffect, useState } from "react";
import "./MessageInfo.css"
import { getMessageInfo } from "@/services/messagingservice/getMessageInfo";
import { useChat } from "@/contexts/ChatContext";
import SentTicks from "../SentTicks/SentTicks";
import DeliveredTicks from "../DeliveredTicks/DeliveredTicks";
import ReadTicks from "../ReadTicks/ReadTicks";
import PendingSend from "../PendingSend/PendingSend";
import MessageAttachmentRenderer from "../MessageAttachment/MessageAttachementRenderer";


const MessageInfo = ({ message }) => {
    const [deliveredTime, setDeliveredTime] = useState(null);
    const [readTime, setReadTime] = useState(null);
    const { currentChat } = useChat();

    useEffect(() => {
        const setStates = async () => {
            try {
                if (currentChat != null && message != null) {
                    const { deliveredTime: myDeliveredTime, readTime: myReadTime } = await getMessageInfo(message.id, currentChat.othersId);
                    setDeliveredTime(myDeliveredTime?.slice(0, 19).replace("T", " "));
                    setReadTime(myReadTime?.slice(0, 19).replace("T", " "));
                }
            } catch (error) {
                console.error(error);
            }
        }
        setStates();
    }, [message, currentChat]);


    return ( 
        <div className="messaging-info-read-deliver">
            <div className="message-info-content">
                <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                    {message.media && <MessageAttachmentRenderer myMessage={message}  />}
                    {message.content}
                </div>  
                <div className='message-info'>
                    <span className='time'>{message.time}</span>
                
                    <span className='message-status'>
                        {message.state === 0 && <SentTicks width='12px' />}
                        {message.state === 1 && <DeliveredTicks width='12px' />}
                        {message.state === 2 && <ReadTicks width='12px' />}
                        {message.state === 4 && <PendingSend width='12px' />}
                    </span>
                </div>
            </div>
            <div className="delivered-at">
                <span>Delivered at: {deliveredTime}</span>
            </div>
            <div className="read-at">
                <span>Read at: {readTime ? readTime : "Not read"}</span>
            </div>
        </div>
    );
}
 
export default MessageInfo;