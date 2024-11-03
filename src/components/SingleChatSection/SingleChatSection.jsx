import { useEffect, useMemo, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEllipsisV,
    faMicrophoneAlt,
    faPaperclip,
    faPhone,
    faSearch,
    faPaperPlane, faImage, faFile, faTimes, faCircleNotch ,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList';
import usePost from '../../services/usePost';
import { whoAmI } from '../../services/chatservice/whoAmI'
import useVoiceRecorder from '@/hooks/useVoiceRecorder'
import { formatDuration } from '@/utils/formatDuration'
import { useRef } from 'react'

const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageToSend, setMessageToSend] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const {isRecording, duration, audioUrl, startRecording, stopRecording, discardRecording} = useVoiceRecorder()
    const [userDetails, setUserDetails] = useState({})

    const [attachedFile, setAttachedFile] = useState(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const [attachmentType, setAttachmentType] = useState(-1);
    const { data: uploadData, error:errorUpload, loading: loadingUpload } = useFetch('/uploadAttachment');
    const [sending, setSending] = useState(false);
    
    const { data: messages, loading: messagesLoading, error: messagesError} = useFetch('/userMessages');
    const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend);
    const { data: userDetailsFromBack, loading, error } = useFetch('/userDetails')


    const showSendIcon = useMemo(() => isTyping || isRecording, [isTyping, isRecording])


    // TODO : move the message sending logic to the message component to handle failures and retrying
    const sendMessage = async (type, message) => {
        
        const tempMessageObject = {
            id:4,
            chatId: localMessages.chatId,
            senderId: whoAmI.id,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            parentMessageId: null,
            time:new Date().toLocaleTimeString(),
            state:"pending",
            othersId: selectedUser.userId,
        }

        if(isRecording) {
            stopRecording((url) => {
                // This will execute after the audio URL is available
                tempMessageObject.content = url; // Now it has the correct audio URL
                tempMessageObject.type = messageTypes.AUDIO;
                setMessageToSend(tempMessageObject)
                setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages])
            })
            return;
        }

        if (type === messageTypes.TEXT) {
            tempMessageObject.content = message
            tempMessageObject.type = messageTypes.TEXT
            tempMessageObject.file = null
            tempMessageObject.blobName = null
            tempMessageObject.objectLink = ""
            tempMessageObject.fileType = attachmentType

            if (attachedFile !== null) {
                setSending(true);
                tempMessageObject.file=attachedFile;
                removeAttachment();
                if (uploadData) {
                    let blob = await uploadFile(tempMessageObject,uploadData);
                    if (blob) {
                        tempMessageObject.blobName = blob.blobName;
                    }
                    
                }
                if (errorUpload) {
                    console.log(errorUpload)
                }
                setSending(false);
            }
        }
            
        setMessageToSend(tempMessageObject);
        setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages]);
        
    }
    
    console.log("user" ,selectedUser)
    

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping)
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
        else
        {
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
    
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    }

    console.log("user" ,selectedUser)
    

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
    useEffect(() => {

        if(messages && !messagesError && !messagesLoading) {
            console.log(messages)
            const thisChatMessages = messages.filter(
                (message) =>  message.othersId === selectedUser.userId
            );
            console.log(thisChatMessages)
            setLocalMessages(thisChatMessages);
        }

        if (userDetailsFromBack && !error && !loading) setUserDetails(userDetailsFromBack)
            
    }, [messages, selectedUser, userDetailsFromBack])


    return (
        <div className='single-chat-container'>
            <div className='single-chat-header shadow-md'>
                <div className='header-avatar'>
                    <img src={selectedUser.profilePic} alt={selectedUser.name} />
                </div>
                <div className='header-details'>
                    <span className='header-title'>{selectedUser.name}</span>
                    <span className='header-subtitle'>Last seen at {selectedUser.lastSeen}</span>
                </div>
                <div className='header-icons'>
                    <FontAwesomeIcon height={24} className='icon' icon={faSearch} />
                    <FontAwesomeIcon height={24} className='icon' icon={faPhone} />
                    <FontAwesomeIcon height={24} className='icon' icon={faEllipsisV} />
                </div>
            </div>
            <div className='messages'>
                <SingleChatMessagesList user={selectedUser} messages={localMessages} />
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    {
                        sending && (
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        )
                    }
                    {
                        attachedFile && (
                                    <div className="attachment-preview">
                                        <span>{formatFileName(attachedFile.name,10)}</span>
                                        <button onClick={removeAttachment} className="remove-attachment">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                        )
                    }
                    <div className='input-container shadow'>
                        <div className="textmessage-emoji-container">
                            <SingleChatMessaging updateIconSend={updateIconSend} sendMessage={sendMessage}/>
                        </div>
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
                         {isRecording ? (
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-lg font-semibold">{formatDuration(duration)}</span>
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            </div>
                        ) : (
                        <div className="attachements-container relative">
                            <FontAwesomeIcon icon={faPaperclip} onClick={toggleAttachMenu} />
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
                    {isRecording && (
                        <div className='cancel-voice-recording' onClick={discardRecording}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                    )}
                    <div className={`voice-send-container ${showSendIcon ? 'active' : ''}`} onClick={showSendIcon ? sendMessage : startRecording}>
                        <FontAwesomeIcon
                            icon={showSendIcon ? faPaperPlane : faMicrophoneAlt}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleChatSection
