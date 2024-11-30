import React, { useRef, useEffect } from 'react';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SingleStory from '../SingleStory/SingleStory';
import './StoriesList.css';
import { useStories } from '@/contexts/StoryContext';

const StoriesList = ({ onClose, handleAddStory }) => {
    const { stories, selectStory, currentIndex, closeStories } = useStories();
    const fileInputRef = useRef(null);
    

    const handleNextStory = () => {
        selectStory(true);
    };

    const handlePrevStory = () => {
        selectStory(false);
    };

    const handleAddNewStoryClick = () => {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
            const filePreview = URL.createObjectURL(file);
            handleAddStory(file, filePreview);
        }
    };

    useEffect(() => {
        
    }, [stories, currentIndex]);


  return (
    <div className="my-stories-container">
        <div className="story-wrapper">
            <SingleStory
                onNextStory={handleNextStory}
                handleAddNewStoryClick={handleAddNewStoryClick}
                onClose={onClose}
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button 
                    onClick={() => handlePrevStory()}
                    className="nav-button"
                    aria-label="Previous story"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-6 w-6" />
                </button>
                <button
                    onClick={() => handleNextStory()}
                    className="nav-button"
                    aria-label="Next story"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="h-6 w-6" />
                </button>
            </div>
            <div className="indicators-container">
                {stories?.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${
                            index === currentIndex
                                ? 'indicator-active'
                                : 'indicator-inactive'
                        }`}
                    />
                ))}
            </div>
        </div>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => {
                handleFileChange(event); // Your file handling logic
            }}
        />
    </div>
  );
};

export default StoriesList;
