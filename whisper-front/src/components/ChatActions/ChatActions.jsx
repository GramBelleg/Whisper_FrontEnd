import './ChatActions.css'
import { formatDuration } from '@/utils/formatDuration'
import ChatTextingActions from '../ChatTextingActions/ChatTextingActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faFile, faImage, faMicrophoneAlt, faPaperclip, faPaperPlane, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useRef, useState } from 'react'
import useVoiceRecorder from '@/hooks/useVoiceRecorder'
import { messageTypes } from '@/services/sendTypeEnum'
import ParentMessage from '../ParentMessage/ParentMessage'
import { useChat } from '@/contexts/ChatContext'
import useFetch from '@/services/useFetch'
import CustomGifPicker from '../CustomGifPicker/CustomGifPicker'

const ChatActions = () => {
    const [textMessage, setTextMessage] = useState('')
    const { isRecording, duration, startRecording, stopRecording, discardRecording } = useVoiceRecorder()
    const { sendMessage, sending } = useChat()

    const [attachedFile, setAttachedFile] = useState(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const [attachmentType, setAttachmentType] = useState(-1);
    const { data: uploadData, error:errorUpload, loading: loadingUpload } = useFetch('/uploadAttachment');
    const isTyping = useMemo(() => textMessage.length > 0, [textMessage])

    const showSendIcon = useMemo(() => isTyping || isRecording, [isTyping, isRecording])

    

    const removeAttachment = () => {
        setAttachedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        setAttachmentType(-1)
    }
    const toggleAttachMenu = () => {
        setShowAttachMenu(!showAttachMenu);
    }

    const handleFileAttach = () => {
        fileInputRef.current.click();
        setAttachmentType(0)
        setShowAttachMenu(false);
    }
    const handleImageAttach = () => {
        imageInputRef.current.click();
        setAttachmentType(1)
        setShowAttachMenu(false);
    }
    const handleGifAttach = async (gifObject) => {
        // sendMessage(messageTypes.IMAGE, url)

        try {
            const response = await fetch(gifObject.url);
            const blob = await response.blob();
            
            const file = new File([blob], `${gifObject.id}.gif`, { type: 'image/gif' });
            console.log("gif" ,file)
            setAttachedFile(file);
            setAttachmentType(1);
            return file;
          } catch (error) {
            console.error("Error converting GIF to File:", error);
            return null;
          }
    }

    const formatFileName = (fileName, length) => {
        if (fileName.length > 20) {
            return `${fileName.slice(0, length)}...`; 
        }
        return fileName; 
    }


    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    }

    const uploadFile = async (data) => {
        
        let presignedUrl = data.presignedUrl;
        let blobName = data.blobName;
        let blob = new Blob([attachedFile]);
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: blob,
            headers: {
                "x-ms-blob-type": "BlockBlob", 
            },
        });

        if (!uploadResponse.ok) {
            console.log("Error uploading file");
            return null;
        }
        else
        {
            console.log(`file uploaded successfully`);
            return { blobName };
        }
        
    }

    const triggerSendMessage = async () => {
        if (isRecording) {
            stopRecording((audioURL) => {
                sendMessage(messageTypes.AUDIO, audioURL)
            })
            return
        } else if (textMessage.trim()) {
            let attachmentPayload = null;
            if (attachedFile !== null) {
                attachmentPayload = {
                    type: attachmentType,
                    file: attachedFile
                }
                removeAttachment();
                if (uploadData) {
                    let blob = await uploadFile(uploadData);
                    if (blob) {
                        attachmentPayload.blobName = blob.blobName;
                    }
                }
                if (errorUpload) {
                    console.log(errorUpload)
                }
            }
            sendMessage(messageTypes.TEXT, textMessage, attachmentPayload)
            setTextMessage('')
        }
    }

    return (
        <div className='chat-actions-container'>
            <div className='input-container shadow transition-all duration-300'>
                <ParentMessage />
                <div className='actions-row'>
                {
                    sending && (
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    )
                }
                {attachedFile && (
                                <div className="attachment-preview">
                                    <span>{formatFileName(attachedFile.name,10)}</span>
                                    <button onClick={removeAttachment} className="remove-attachment">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            )}
                    <div className='textmessage-emoji-container'>
                        <ChatTextingActions
                            textMessage={textMessage}
                            setTextMessage={setTextMessage}
                            triggerSendMessage={triggerSendMessage}
                        />
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }} 
                            id="file-input" 
                            ref={fileInputRef}
                        />
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }} 
                            id="image-input" 
                            ref={imageInputRef}
                        />
                        <CustomGifPicker onGifSelect={handleGifAttach}/>
                    </div>

                    {isRecording ? (
                        <div className='flex items-center justify-center space-x-2'>
                            <span className='text-lg font-semibold'>{formatDuration(duration)}</span>
                            <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
                        </div>
                    ) : (
                        <div className='attachements-container relative'>
                                <FontAwesomeIcon icon={faPaperclip} onClick={toggleAttachMenu}/>
                                {showAttachMenu && (
                                    <div className="attach-menu absolute bottom-full left-0 bg-white shadow-md rounded-md p-2">
                                        <button onClick={handleFileAttach} className="block w-full text-left py-1 px-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faFile} className="mr-2" />
                                        </button>
                                        <button onClick={handleImageAttach} className="block w-full text-left py-1 px-2 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                                        </button>
                                    </div>
                                )}
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
