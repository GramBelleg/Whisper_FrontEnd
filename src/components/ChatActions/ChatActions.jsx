import './ChatActions.css'
import { formatDuration } from '@/utils/formatDuration'
import ChatTextingActions from '../ChatTextingActions/ChatTextingActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faFile, faImage, faMicrophoneAlt, faPaperclip, faPaperPlane, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import useVoiceRecorder from '@/hooks/useVoiceRecorder'
import { messageTypes } from '@/services/sendTypeEnum'
import { useChat } from '@/contexts/ChatContext'
import { useModal } from '@/contexts/ModalContext'
import useFetch from '@/services/useFetch'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import ParentMessage from '../ParentMessage/ParentMessage'
import { uploadMedia } from '@/services/chatservice/media'
import CustomStickersPicker from '../CustomStickersPicker/CustomStickersPicker'
import UnifiedPicker from '../UnifiedPicker/UnifiedPicker'
import { draftMessage } from '@/services/chatservice/draftMessage'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'

const ChatActions = () => {
    const [textMessage, setTextMessage] = useState('')
    const { isRecording, duration, startRecording, stopRecording, discardRecording } = useVoiceRecorder()
    const { sendMessage, sending, parentMessage } = useChat()

    const [attachedFile, setAttachedFile] = useState(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const [attachmentType, setAttachmentType] = useState(-1);
    const { data: uploadData, error:errorUpload, loading: loadingUpload } = useFetch('/uploadAttachment');
    const isTyping = useMemo(() => textMessage.length > 0, [textMessage])

    const showSendIcon = useMemo(() => (parentMessage && parentMessage.relationship === parentRelationshipTypes.FORWARD) || isTyping || isRecording, [parentMessage, isTyping, isRecording])
    const { openModal, closeModal } = useModal();

    const handleGifAttach = (gifFile) => {
        setAttachedFile(gifFile);
        setAttachmentType(1);
    }

    const handleStickerAttach = (url) => {
        sendMessage(messageTypes.IMAGE, url)
    }
    const { currentChat } = useChat();
    const { db } = useWhisperDB();
    const [ chatId, setChatId ] = useState(-1);

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


    const uploadFile = async (tempMessageObject, data) => {
        let presignedUrl = data.presignedUrl;
        let blobName = data.blobName;
        let blob = new Blob([tempMessageObject.file]);
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
        else {
            console.log(`file uploaded successfully`);
            tempMessageObject.blobName = blobName;
            return { blobName };
        }
        
    }

    const formatFileName = (fileName, length) => {
        if (fileName.length > 20) {
            return `${fileName.slice(0, length)}...`; 
        }
        return fileName; 
    };
    const validFile = (file) => {
        if (file.size > 50 * 1024 * 1024) {
            return false;
        }
        return true;
    }
    
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            if(validFile(e.target.files[0]))
                setAttachedFile(e.target.files[0]);
            else
            openModal(
                <ErrorMesssage errorMessage={"Maximum upload size is 50 mb"} onClose={closeModal} appearFor={2000}/>
            );
        }
    }

    const removeAttachment = () => {
        setAttachedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        if (audioInputRef.current) {
            audioInputRef.current.value = '';
        }
        setAttachmentType(-1)
    }

    const handleAudioAttach = () => {
        audioInputRef.current.click();
        setAttachmentType(2)
        setShowAttachMenu(false);
    }

    const triggerSendMessage = async () => {
        if (isRecording) {
            stopRecording(async (audioBlob) => {
                const blobName = await uploadMedia({
                    extension: 'wav',
                    file: audioBlob
                });
                sendMessage({
                    type: messageTypes.AUDIO,
                    content: '',
                    media: blobName,
                    extension: 'wav'
                })
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
            sendMessage({
                type: messageTypes.TEXT,
                content: textMessage,
                file: attachmentPayload ? attachmentPayload.file : null,
                media: attachmentPayload ? attachmentPayload.blobName : null,
                extension: attachmentPayload ? attachmentPayload.type : null,
                size: attachmentPayload ? attachmentPayload.file.size : null
            })
            setTextMessage('')
        }
    }

    useEffect(() => {
        const setMessageByDrafted = async () => {
            try {
                if (currentChat) {
                    const lastMessage = await dbRef.current.getDraftedMessage(currentChat.id);
                    if (lastMessage) {
                        setTextMessage(lastMessage);
                    } else {
                        setTextMessage('');
                    }
                }
            } catch (error) {
                console.log(error);
                setTextMessage('');
            }
        }

        const setDraftedMessage = async () => {
            if (textMessage && textMessage.length > 0) {
                try {
                    const draftTime = new Date().toISOString();
                    const draftedMessage = {
                        chatId: chatId,
                        draftContent: textMessage,
                        draftTime: draftTime
                    };
                    

                    //await draftMessage(draftedMessage);

                    console.log("Drafting message")
                   
                    await dbRef.current.insertDraftedMessage(draftedMessage);
                } catch (error) {
                    console.log(error.message);
                }
            }
            if (currentChat) {
                setChatId(currentChat.id);
            }
        }
        
        setDraftedMessage();
        setMessageByDrafted();

    }, [currentChat])

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
                {
                    attachedFile && (
                        <div className="attachment-preview" data-testid="attachment-preview">
                            <span>{formatFileName(attachedFile.name,10)}</span>
                            <button onClick={removeAttachment} className="remove-attachment"  data-testid="remove-attachment-button">
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
                            data-testid="input-file"
                        />
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }} 
                            id="image-input" 
                            ref={imageInputRef}
                            data-testid="input-image"
                        />
                        <input 
                            type="file" 
                            accept="audio/mpeg,audio/wav" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }} 
                            id="audio-input" 
                            ref={audioInputRef}
                            data-testid="input-audio"
                        />
                        <UnifiedPicker
                            onGifSelect={handleGifAttach}
                            onStickerSelect={handleStickerAttach}
                        />

                    </div>

                    {isRecording ? (
                        <div className='flex items-center justify-center space-x-2'>
                            <span className='text-lg font-semibold'>{formatDuration(duration)}</span>
                            <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
                        </div>
                    ) : (
                        <div className='attachements-container relative'>
                                <FontAwesomeIcon icon={faPaperclip} onClick={toggleAttachMenu} data-testid="attach-icon"/>
                                {
                                    showAttachMenu && (
                                        <div className="attach-menu absolute bottom-full left-0 bg-white shadow-md rounded-md p-2" data-testid="attach-menu">
                                            <button onClick={handleFileAttach} className="block w-full text-left py-1 px-2 hover:bg-gray-100">
                                                <FontAwesomeIcon icon={faFile} className="mr-2" data-testid="attach-file" />
                                            </button>
                                            <button onClick={handleImageAttach} className="block w-full text-left py-1 px-2 hover:bg-gray-100">
                                                <FontAwesomeIcon icon={faImage} className="mr-2" data-testid="attach-image" />
                                            </button>
                                            <button onClick={handleAudioAttach} className="block w-full text-left py-1 px-2 hover:bg-gray-100">
                                                <FontAwesomeIcon icon={faMusic} className="mr-2" data-testid="attach-audio"/>
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
