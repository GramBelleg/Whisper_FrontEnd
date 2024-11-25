import { useEffect, useRef, useState } from "react";
import "./SingleStory.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEye } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { setStoryPrivacySettings } from "@/services/storiesservice/setStoryVisibility";
import { useStories } from "@/contexts/StoryContext";

const SingleStory = ({ onNextStory, onDeleteStory, handleAddNewStoryClick, onClose }) => {
    const { loading, error, url, currentStory, fetchStoryUrl } = useStories();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [visibilityDropDownVisible, setVisibilityDropDownVisible] = useState(false);
    const [remainingTime, setRemainingTime] = useState(20000); // 20 seconds
    const [storyVisibility, setStoryVisibility] = useState("Everyone");
    const storyVisibilityChangedRef = useRef(false);
    const videoRef = useRef();
    const intervalRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const dropdownRef = useRef(null);
    const {openModal, closeModal} = useModal();

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !event.target.closest(".within-story-visibility")
        ) {
            setDropdownVisible(false);
            setVisibilityDropDownVisible(false);
            startInterval(); 
            if(storyVisibilityChangedRef.current === true) {
                try {
                    setStoryPrivacySettings(currentStory?.id, storyVisibility);
                } catch (error) {
                    openModal(
                        <ErrorMesssage
                            errorMessage={error.message}
                            onClose={closeModal}
                            appearFor={3000}
                        />
                    )
                    setTimeout(() => { onClose(); },  3000);
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        setDropdownVisible(false);
        setVisibilityDropDownVisible(false);
        storyVisibilityChangedRef.current = false;
        dropdownRef.current = null;
        videoRef.current = null;
        
        return () => {
            clearTimeout(intervalRef.current);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [currentStory?.id]);

    useEffect(() => {
        intervalRef.current = null;
        startTimeRef.current = Date.now();
        startInterval();
    }, [url])

    useEffect(() => {
        if (error) {
            openModal(
                <ErrorMesssage
                    errorMessage={error.message}
                    onClose={closeModal}
                    appearFor={3000}
                />
            )
            setTimeout(() => { onClose() },  3000);
        }
    }, error)

    const handleDeleteStory = () => {
        onDeleteStory(intervalRef);
    }

    const startInterval = () => {
        intervalRef.current = setTimeout(() => {
            onNextStory(); 
        }, remainingTime);
        startTimeRef.current = Date.now();
    };

    const pauseInterval = () => {
        clearTimeout(intervalRef.current);
        const elapsedTime = Date.now() - startTimeRef.current;
        setRemainingTime((prev) => prev - elapsedTime);
    };

    const handleDropdownToggle = () => {
        setDropdownVisible((visible) => {
            if (!visible) {
                pauseInterval();
            } else {
                startInterval();
            }
            return !visible;
        });
    };

    const handleEditVisibility = () => {
        setDropdownVisible(false);
        setVisibilityDropDownVisible(true);
        
    };

    const handleVisibilityChange = (value) => {
        setStoryVisibility(value);
        storyVisibilityChangedRef.current = true
    }

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex items-center justify-center w-full h-full text-red-500">
                    Error: {error}
                </div>
            );
        }

        if (currentStory && currentStory?.type.startsWith("image/")) {
            return (
                <img
                    src={url}
                    alt="Story content"
                    className="w-full h-full object-contain"
                    onError={() => setError("Failed to load image")}
                />
            );
        }
        if (currentStory && currentStory?.type.startsWith("video/")) {
            return (
                <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-contain"
                >
                <source
                    src={url}
                    type={currentStory.type}
                    onError={() => setError("Failed to load video")}
                />
                    Your browser does not support this video format.
                </video>
            );
        }
    };

  return (
        <>
            <div className="dropdown-container">
                <button onClick={handleDropdownToggle} className="three-dots-button" aria-label="Options">
                    <FontAwesomeIcon icon={faEllipsisV} className="h-8 w-8" />
                </button>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button onClick={handleAddNewStoryClick} className="dropdown-item add">Add</button>
                        <button onClick={handleDeleteStory} className="dropdown-item delete">Delete</button>
                        <div className="edit-visibility-within-story">
                            <FontAwesomeIcon icon={faEye} />
                        <button onClick={handleEditVisibility} className="dropdown-item visibility">
                            Who Can See My Story?
                        </button>
                        </div>
                    </div>
                )}
            </div>
            {visibilityDropDownVisible && (
                <div className="within-story-visibility" ref={dropdownRef}>
                    <label>
                        <input type="radio" value="Everyone" checked={storyVisibility === "Everyone"} onChange={() => {handleVisibilityChange("Everyone")}} />
                        Everyone
                    </label>
                    <label>
                        <input type="radio" value="Contacts" checked={storyVisibility === "Contacts"} onChange={() => {handleVisibilityChange("Contacts")}} />
                        My Contacts
                    </label>
                    <label>
                        <input type="radio" value="Nobody" checked={storyVisibility === "Nobody"} onChange={() => {handleVisibilityChange("Nobody")}} />
                        No One
                    </label>
                </div>
            )}
            {renderContent()}
            <div className="story-content-text">
                {currentStory?.content}
            </div>
        </>
    );
};

export default SingleStory;