import "./AddNewStoryModal.css";
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker';
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { uploadBlob } from "@/services/blobs/blob";
import { downloadLink, uploadLink } from "@/mocks/mockData";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { useModal } from "@/contexts/ModalContext";
import { useStories } from "@/contexts/StoryContext";

const AddNewStoryModal = ({ file, filePreview, onClose }) => {
    const textareaRef = useRef(null);
    const [storyText, setStoryText] = useState('');
    const [fileType, setFileType] = useState('');
    const [loading, setLoading] = useState(false);
    const { openModal , closeModalError } = useModal();
    const { storiesSocket } = useStories();
    
    const updateNewMessage = (event) => {
        textareaRef.current.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;

        if (event.target.scrollHeight <= 200) {
            const value = event.target.value;
            setStoryText(value);
        }

    };

    const sendStory = async () => {
        setLoading(true);
        try {
            const blobName = await uploadBlob(file, uploadLink);
            if(blobName) {
                const newStory = {
                        "content": storyText,
                        "media": downloadLink.presignedUrl,
                        "type": fileType,
                }

                storiesSocket.sendData(newStory);

                // onStoryAdded(); TODO: send story
                setLoading(false);
                onClose();
            }
        } catch (error) {
            setLoading(false);
            openModal(
                <ErrorMesssage 
                    errorMessage={error.message} 
                    onClose={closeModalError}
                    appearFor={3000}
                />)
            setTimeout(() => {
                onClose()
            }, 3000);
        } 
    }

    const handleKeyPress = async(e) => {
        
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendStory();
        }
    };

    const handleCancelText = () => {
        setStoryText('');
    }

    const handleEmojiClick = () => {
        setStoryText((prevMessage) => prevMessage + emojiObject.emoji);
    }

    useEffect(() => {
        setStoryText('');
        setFileType(null);

        if(file) {
            setFileType(file.type);
        }
    }, [file])


    useEffect(() => {
        if (storyText.length === 0) {
            textareaRef.current.style.height = 'auto';
        }
    }, [storyText]);

    const showLoading = () => {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
        );
    }

    return (
        
        (
            file && (
                <div className="add-new-story-modal">
                    <FontAwesomeIcon className="cancel-modal" icon={faTimes} onClick={() => onClose()} />
                    
                    {fileType ? (
                        <img className="story-preview" src={filePreview} alt="Story Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                        <video className="story-preview" controls src={filePreview} style={{ maxWidth: '100%', height: 'auto' }} />
                    )}
                
                    <div className="story-data">
                        <div className='stories-emojis-container'>
                            <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
                        </div>
                        <textarea
                            type='text'
                            ref={textareaRef}
                            value={storyText}
                            onInput={updateNewMessage}
                            onKeyDown={handleKeyPress}
                            className='message-input'
                            placeholder='Message Here'
                            rows={1}
                        />
                        {storyText.length !== 0 && <FontAwesomeIcon className="cancel-type" icon={faTimes} color='grey' onClick={handleCancelText} />}
                        <FontAwesomeIcon className="send-story-icon" icon={faPaperPlane} onClick={sendStory}/>
                    </div>

                    {loading && showLoading()}
                </div>
            )
        )     
       
    );
};
 
export default AddNewStoryModal;
