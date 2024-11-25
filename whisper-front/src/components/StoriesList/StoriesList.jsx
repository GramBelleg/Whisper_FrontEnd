import React, { useState, useRef, useEffect } from 'react';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SingleStory from '../SingleStory/SingleStory';
import './StoriesList.css';
import ErrorMesssage from '../ErrorMessage/ErrorMessage';
import { useModal } from '@/contexts/ModalContext';
import { useStories } from '@/contexts/StoryContext';

const StoriesList = ({ onClose, handleAddStory, handleDeleteStory }) => {
    const { stories, storiesSocket, selectStory, currentIndex } = useStories();
    const fileInputRef = useRef(null);
    const { openModal, closeModal }  = useModal();
    

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

    const myHandleDeleteStory = async (intervalRef) => {
        try {
            
            const storyId = stories[currentIndex].id;
            storiesSocket.deleteData(storyId);
            const newStories = stories.filter(story => story.id !== storyId);
            //setStories(newStories);
            if (currentIndex <= newStories.length - 1) { 
                //setCurrentIndex((prev) => (prev < newStories.length - 1 ? prev + 1 : 0));
            }
            else {
                clearTimeout(intervalRef.current);
                onClose();
            }
            handleDeleteStory();

        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={5000}/>)
        }
        
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
  
            const filePreview = URL.createObjectURL(file);
            // Add the new story to the myStories mock -> TODO: call API
            handleAddStory(file, filePreview);
        }
    };

    useEffect(() => {}, [stories]);


  return (
    <div className="my-stories-container">
        <div className="story-wrapper">
            <SingleStory
                story={stories[currentIndex]}
                onNextStory={handleNextStory}
                onDeleteStory={myHandleDeleteStory}
                handleAddNewStoryClick={handleAddNewStoryClick}
                onClose={onClose}
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button 
                    onClick={() => { handlePrevStory()}}
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
                {stories.map((_, index) => (
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
            onChange={handleFileChange}
        />
    </div>
  );
};

export default StoriesList;
