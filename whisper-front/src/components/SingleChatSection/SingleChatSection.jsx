import { useEffect, useState } from 'react'
import './SingleChatSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faMicrophone, faMicrophoneAlt, faPaperclip, faPhone, faSearch, faSmile, faPaperPlane, faImage, faFile, faTimes, faCircleNotch, faMusic } from '@fortawesome/free-solid-svg-icons'
import SingleChatMessaging from '../SingleChatMessaging/SingleChatMessaging'
import { messageTypes } from '../../services/sendTypeEnum';
import useFetch from "../../services/useFetch"
import SingleChatMessagesList from '../SingleChatMessagesList/SingleChatMessagesList';
import usePost from '../../services/usePost';
import { whoAmI } from '../../services/chatservice/whoAmI'
import { useRef } from 'react'
import { useModal } from '../../contexts/ModalContext';
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
const SingleChatSection = ({ selectedUser }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [messageToSend, setMessageToSend] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    
    const { data: messages, loading: messagesLoading, error: messagesError} = useFetch('/userMessages');
    const { data: sentMessageData, error: sendError, loading: sendLoading } = usePost('/userMessages', messageToSend);
    const [attachedFile, setAttachedFile] = useState(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const [attachmentType, setAttachmentType] = useState(-1);
    const { data: uploadData, error:errorUpload, loading: loadingUpload } = useFetch('/uploadAttachment');
    const [sending, setSending] = useState(false);
    const { openModal, closeModal } = useModal();

    const sendMessage = async (type, message) => {
        setSending(true);
        if(type === messageTypes.TEXT) {
            const tempMessageObject = {
                id:4,
                chatId: localMessages.chatId,
                senderId: whoAmI.id,
                content: message,
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:new Date().toLocaleTimeString(),
                state:"pending",
                othersId: selectedUser.userId,
                file: null,
                blobName: null,
                objectLink: "",
                fileType: attachmentType,
                size: null,
                autoDownload: null,
            }
            if (attachedFile !== null) {
                tempMessageObject.file=attachedFile;
                tempMessageObject.size = attachedFile.size;
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
            }
            
            setMessageToSend(tempMessageObject);
            setLocalMessages((prevMessages) => [tempMessageObject, ...prevMessages]);
            setSending(false);
        }
    }

    const updateIconSend = (isTyping) => {
        setIsTyping(isTyping);
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

    const handleAudioAttach = () => {
        audioInputRef.current.click();
        setAttachmentType(2)
        setShowAttachMenu(false);
    }

    useEffect(() => {
        if(messages && !messagesError && !messagesLoading) {
            const thisChatMessages = messages.filter(
                (message) =>  message.othersId === selectedUser.userId
            );
            setLocalMessages(thisChatMessages);
        }
    }, [messages, selectedUser])

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
                <SingleChatMessagesList user={selectedUser} messages={localMessages} data-testid="messages-list"/>
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className='chat-actions-container'>
                    {sending && (
                        <FontAwesomeIcon icon={faCircleNotch} size="2x" color='#8d6aee' spin />
                    )}
                    {attachedFile && (
                        <div className="attachment-preview" data-testid="attachment-preview">
                            <span>{formatFileName(attachedFile.name,10)}</span>
                            <button onClick={removeAttachment} className="remove-attachment"  data-testid="remove-attachment-button">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    )}
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
                        <div className="attachements-container relative">
                            <FontAwesomeIcon icon={faPaperclip} onClick={toggleAttachMenu} data-testid="attach-icon" />
                            {showAttachMenu && (
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
                    </div>
                    <div className="voice-send-container">
                        {isTyping ? <FontAwesomeIcon icon={faPaperPlane}/> : <FontAwesomeIcon icon={faMicrophoneAlt} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleChatSection;