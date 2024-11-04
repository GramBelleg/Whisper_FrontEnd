import React, { useState, useEffect, useRef } from 'react';
import { faArrowLeft, faArrowRight, faEllipsisV, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MySingleStory from '../MySingleStory/MySingleStory';
import './MyStoriesList.css';

const MyStoriesList = ({ incomingStories, onClose, handleAddStory }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [visibilityDropDownVisibile, setVisibilityDropDownVisibile] = useState(false);
    const intervalRef = useRef(null);
    const dropdownRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const timeOut = 20000;
    const [remainingTime, setRemainingTime] = useState(timeOut); // Initial time of 20 seconds
    const [stories, setStories] = useState(incomingStories);
    const fileInputRef = useRef(null);
    const [storyVisibility, setStoryVisibility] = useState("everybody");


    const handleDeleteStory = () => {
        const storyId = stories[currentIndex].id;
        const newStories = stories.filter(story => story.id !== storyId);
        setStories(newStories);
        if (currentIndex <= newStories.length - 1) { 
            setCurrentIndex((prev) => (prev < newStories.length - 1 ? prev + 1 : 0));
            setRemainingTime(timeOut); // Reset to 20 seconds
            startInterval();
        }
        else {
            onClose();
            clearTimeout(intervalRef.current);
        }

    }
    
    const handleAddNewStoryClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const startInterval = () => {
        intervalRef.current = setTimeout(() => {
            setCurrentIndex((prev) => {
                if (prev === stories.length - 1) {
                    onClose(); // Close the component if it’s the last story
                    return prev;
                }
                return prev + 1;
            });
            setRemainingTime(timeOut); // Reset timer to 20 seconds for the next story
        }, remainingTime);
        startTimeRef.current = Date.now();
    };

    const pauseInterval = () => {
        clearTimeout(intervalRef.current);
        const elapsedTime = Date.now() - startTimeRef.current;
        setRemainingTime((prev) => prev - elapsedTime); // Update remaining time based on elapsed time
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
        setRemainingTime(timeOut); // Reset to 20 seconds
        startInterval();
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
        setRemainingTime(timeOut); // Reset to 20 seconds
        startInterval();
    };

    const toggleDropdown = () => {
        setDropdownVisible((visible) => {
            if (!visible) {
                pauseInterval(); // Pause when opening
            } else {
                startInterval(); // Resume when closing
            }
            return !visible;
        });
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !event.target.closest(".within-story-visibility")
        ) {
            setDropdownVisible(false);
            setVisibilityDropDownVisibile(false);
            startInterval(); // Resume interval when clicking outside
        }
    };
    

    useEffect(() => {

        startInterval(); // Start the interval when the component mounts

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            clearTimeout(intervalRef.current); // Clear timeout on unmount
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [stories.length, onClose, currentIndex]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
  
            const filePreview = URL.createObjectURL(file);
            // Add the new story to the myStories mock -> TODO: call API
            handleAddStory(file, filePreview);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            handleNext();
        } else if (event.key === 'ArrowLeft') {
            handlePrevious();
        }
    };

    const handleEditVisibility = () => {
        setDropdownVisible(false);
        setVisibilityDropDownVisibile(true);
    }

    if (!stories?.length) {
        return <div className="text-center p-4">No stories to display</div>;
    }

    return (
        <div className="my-stories-container">
            <div className="story-wrapper">
                <div className="story-content">
                    <MySingleStory story={stories[currentIndex]} />
                </div>

                <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                        onClick={handlePrevious}
                        className="nav-button"
                        aria-label="Previous story"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-6 w-6" />
                    </button>

                    <button
                        onClick={handleNext}
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

                {/* Three dots menu */}
                <div className="dropdown-container" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="three-dots-button"
                        aria-label="Options"
                    >
                        <FontAwesomeIcon icon={faEllipsisV} className="h-8 w-8" color='var(--accent-color)' />
                    </button>
                    {dropdownVisible && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleAddNewStoryClick()} className="dropdown-item add">Add</button>
                            <button onClick={() => handleDeleteStory()} className="dropdown-item delete">Delete</button>
                            <div className="edit-visibility-within-story">
                                <FontAwesomeIcon icon={faEye}/>
                                <button onClick={() => handleEditVisibility()} className="dropdown-item visibility">Who Can see My story?</button>
                            </div>
                        </div>
                    )}
                </div>
                    {visibilityDropDownVisibile && (
                        <div className="within-story-visibility">
                            <label>
                                <input 
                                    type="radio" 
                                    value="everybody" 
                                    checked={storyVisibility === "everybody"} 
                                    onChange={() => setStoryVisibility("everybody")} 
                                />
                                Everybody
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="contacts" 
                                    checked={storyVisibility === "contacts"} 
                                    onChange={() => setStoryVisibility("contacts")} 
                                />
                                My Contacts
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="no-one" 
                                    checked={storyVisibility === "no-one"} 
                                    onChange={() => setStoryVisibility("no-one")} 
                                />
                                No One
                            </label>
                    </div>
                    )}
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

export default MyStoriesList;