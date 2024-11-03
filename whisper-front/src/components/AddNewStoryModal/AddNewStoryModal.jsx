import "./AddNewStoryModal.css";
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker';
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { uploadBlob } from "@/services/blobs/blob";
import { downloadLink, uploadLink } from "@/mocks/mockData";
import { addNewStory } from "@/services/storiesservice/addNewStory";

const AddNewStoryModal = ({ file, filePreview, onClose, onStoryAdded }) => {

    const textareaRef = useRef(null);

    const [storyText, setStoryText] = useState('');
    const [fileType, setFileType] = useState('');
    const [storyId, setStoryId] = useState(0); // TODO
    
    const updateNewMessage = (event) => {
        textareaRef.current.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;

        if (event.target.scrollHeight <= 200) {
            const value = event.target.value;
            setStoryText(value);
        }
    };

    const handleKeyPress = async(e) => {
        
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents new line from being added
            // TODO: upload story
            console.log("ahhahha")
            console.log(file)
            const blobName = await uploadBlob(file, uploadLink);
            console.log(blobName);
            console.log(fileType)
            if(blobName) {
                const newStory = {
                        "id": storyId, // TODO
                        "content": storyText,
                        "media": downloadLink.presignedUrl,
                        "type": fileType,
                        "likes": 0,
                        "date": new Date(),
                        "viewed": true
                }

                const addResult = await addNewStory(newStory);
                console.log("Add result" , addResult)
                onStoryAdded();
                setStoryId((prev) => prev + 1);
            }
            onClose();
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
                    </div>
                </div>
            )
        )     
       
    );
};

 
export default AddNewStoryModal;
