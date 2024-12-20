import { useChat } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";
import noUser from '../../assets/images/no-user.png'
import ChatMessage from "../ChatMessage/ChatMessage";
import useAuth from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ChatActions from "../ChatActions/ChatActions";

const ThreadsBar = ({ onClose }) => {
    const { threadMessage } = useChat()
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useAuth()
    const handleClose = () => {
        setIsVisible(false); 
        setTimeout(() => {
            onClose()
        }, 300); 
    };

    useEffect(() => {
        setIsVisible(true); 
    }, []);

    useEffect(() => {
        console.log(threadMessage)
    }, [threadMessage])
    
    return ( 
        <div
            className={`fixed top-[2.5%] right-[4.5%] w-[30%] h-[95%] bg-dark text-light shadow-lg z-999 p-4 rounded-md transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-[200%]"
            }`}
            style={{ 
                backgroundColor: 'var(--accent-color-threads)',
                
             }}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Thread</h3>
                <div className="flex justify-between items-center space-x-4 ">
               
                    <button className="text-white" onClick={handleClose} data-testid="close-button">
                        <FontAwesomeIcon icon={faTimes} style={{ heigth: "25px"}}/>
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-[95%] rounded-md"
                style={{
                    backgroundColor:
                        threadMessage.replies?.length > 0 ? "var(--accent-color-threads)" : "transparent",
                        backgroundImage: "url('./assets/images/chat-background-pattern.svg')"
                }}
            >
                <div
                    className="flex flex-col-reverse h-[100%] gap-4 overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {threadMessage.replies && [...threadMessage.replies].reverse().map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.senderId === user.id 
                                    ? "justify-end mr-4" 
                                    : "justify-start ml-4"
                            }`}
                        >
                            <ChatMessage
                                id={`thread-message-${message.id}`}
                                message={message}
                                hideActions={false}
                                style={{
                                    marginLeft: message.senderId !== user.id ? "1rem" : "0",
                                    marginRight: message.senderId === user.id ? "1rem" : "0",
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="w-full flex items-center justify-center mt-4">
                    <ChatActions />
                </div>
            </div>

        </div>

    );
}
 
export default ThreadsBar;