import { useEffect, useRef, useState } from "react";
import "./MySingleStory.css";
import { downloadBlob } from "@/services/blobs/blob";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEye } from "@fortawesome/free-solid-svg-icons";

const MySingleStory = ({ story, onNextStory, onDeleteStory, fileInputRef }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [url, setUrl] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [visibilityDropDownVisible, setVisibilityDropDownVisible] = useState(false);
    const [remainingTime, setRemainingTime] = useState(20000); // 20 seconds
    const [storyVisibility, setStoryVisibility] = useState("everybody");

    const videoRef = useRef();
    const intervalRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !event.target.closest(".within-story-visibility")
        ) {
            setDropdownVisible(false);
            setVisibilityDropDownVisible(false);
            startInterval(); // Resume interval when clicking outside
        }
    };

    useEffect(() => {

        document.addEventListener("mousedown", handleClickOutside);
        
        setUrl(null);
        setLoading(true);
        setError('');
        // Fetch and set the story URL
        const fetchUrl = async () => {
            try {
                const { blob } = await downloadBlob({ "presignedUrl": story.media });
                const newBlob = new Blob([blob], { type: story.type });
                const objectUrl = URL.createObjectURL(newBlob);
                setUrl(objectUrl);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUrl();

        // Start the timer
        startInterval();

        // Cleanup on unmount
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
            clearTimeout(intervalRef.current);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [story]);

    const handleAddNewStoryClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const startInterval = () => {
        intervalRef.current = setTimeout(() => {
            onNextStory(); // Move to the next story when time runs out
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
        if (!url) {
            return null;
        }

        if (story?.type.startsWith("image/")) {
            return (
                <img
                src={url}
                alt="Story content"
                className="w-full h-full object-contain"
                onError={() => setError("Failed to load image")}
                />
            );
        }
        if (story?.type.startsWith("video/")) {
            return (
                <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-contain"
                >
                <source
                    src={url}
                    type={story.type}
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
                    <button onClick={onDeleteStory} className="dropdown-item delete">Delete</button>
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
                    <input type="radio" value="everybody" checked={storyVisibility === "everybody"} onChange={() => setStoryVisibility("everybody")} />
                    Everybody
                </label>
                <label>
                    <input type="radio" value="contacts" checked={storyVisibility === "contacts"} onChange={() => setStoryVisibility("contacts")} />
                    My Contacts
                </label>
                <label>
                    <input type="radio" value="no-one" checked={storyVisibility === "no-one"} onChange={() => setStoryVisibility("no-one")} />
                    No One
                </label>
            </div>
        )}
        {renderContent()}
        <div className="story-content-text">
                {story?.content}
        </div>
    </>
  );
};

export default MySingleStory;