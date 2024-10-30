import './ChatActions.css'
import { formatDuration } from '@/utils/formatDuration'
import ChatTextingActions from '../ChatTextingActions/ChatTextingActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt, faPaperclip, faPaperPlane, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react'
import useVoiceRecorder from '@/hooks/useVoiceRecorder'
import { messageTypes } from '@/services/sendTypeEnum'
import ParentMessage from '../ParentMessage/ParentMessage'
import { useChat } from '@/contexts/ChatContext'

const ChatActions = () => {
    const [isTyping, setIsTyping] = useState(false)
    const [textMessage, setTextMessage] = useState('')
    const { isRecording, duration, startRecording, stopRecording, discardRecording } = useVoiceRecorder()
    const { sendMessage } = useChat()

    const showSendIcon = useMemo(() => isTyping || isRecording, [isTyping, isRecording])

    const updateTypingState = (isTyping) => {
        setIsTyping(isTyping)
    }

    const triggerSendMessage = () => {
        if (isRecording) {
            stopRecording((audioURL) => {
                sendMessage(messageTypes.AUDIO, audioURL)
            })
            return
        } else if (textMessage.trim()) {
            sendMessage(messageTypes.TEXT, textMessage)
            setTextMessage('') // Clear the input after sending the text message
        }
    }

    return (
        <div className='chat-actions-container'>
            <div className='input-container shadow transition-all duration-300'>
                <ParentMessage />
                <div className='actions-row'>
                    <div className='textmessage-emoji-container'>
                        <ChatTextingActions
                            textMessage={textMessage}
                            setTextMessage={setTextMessage}
                            updateTypingState={updateTypingState}
                            triggerSendMessage={triggerSendMessage}
                        />
                    </div>

                    {isRecording ? (
                        <div className='flex items-center justify-center space-x-2'>
                            <span className='text-lg font-semibold'>{formatDuration(duration)}</span>
                            <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
                        </div>
                    ) : (
                        <div className='attachements-container'>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                    )}
                </div>
            </div>
            {isRecording && (
                <div className='cancel-voice-recording' onClick={discardRecording}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </div>
            )}
            <div
                className={`voice-send-container ${showSendIcon ? 'active' : ''}`}
                onClick={showSendIcon ? triggerSendMessage : startRecording}
            >
                <FontAwesomeIcon icon={showSendIcon ? faPaperPlane : faMicrophoneAlt} />
            </div>
        </div>
    )
}

export default ChatActions
