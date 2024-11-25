import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from '@/services/messagingservice/sockets/sockets'
import StorySocket from "@/services/sockets/StorySocket";
import { getStories } from "@/services/storiesservice/getStories";
import { downloadBlob } from "@/services/blobs/blob";

export const StoryContext = createContext();

export const StoriesProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentStory, setCurrentStory ] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [ stories, setStories ] = useState([]);
    const [uploading, setIsUploading] = useState(false);
    const storiesSocket = new StorySocket(socket);
    const currentUserRef = useRef();
    const currentStoryRef = useRef();
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const selectUser = (user) => {
        setCurrentUser(user);
    };

    const selectStory = (next) => {
        if (next) {
            setCurrentIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
        } else {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
        }
    };

    const uploadStory = async () => {
        // TODO: upload story
    }

    const loadUserStories = async () => {
        try {
            const data = await getStories(currentUser.id);
            console.log("Data ", data);
            setStories([...data]);
        } catch (error) {
            setStories([]);
            console.log(error);
        }
    };

    const fetchStoryUrl = async () => {
        try {
            if(currentStory) {
                const { blob } = await downloadBlob({ "presignedUrl": currentStory.media });
                const newBlob = new Blob([blob], { type: currentStory.type });
                const objectUrl = URL.createObjectURL(newBlob);
                setUrl(objectUrl);
            }
            else {
                throw new Error("Story is not loaded");
            }
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadUserStories();
            setCurrentIndex(0);
            setCurrentStory(stories[currentIndex])
        } else {
            setStories([]);
            setCurrentIndex(0);
            setCurrentStory(null);
        }
        currentUserRef.current = currentUser;
    }, [currentUser]);

    useEffect(() => {
        currentStoryRef.current = currentStory;
        setLoading(true);
        setError(null);
        try {
            fetchStoryUrl();
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, [currentStory]);

    useEffect(() => {
        if (stories) {
            setCurrentStory(stories[currentIndex]);
        }
    }, [currentIndex])

    useEffect(() => {
        if(storiesSocket) {
            //storiesSocket.onReceiveMessage(handleReceiveMessage);
            //storiesSocket.onPinMessage(handlePinMessage);
            //storiesSocket.onUnPinMessage(handleUnpinMessage);
        }
    }, [storiesSocket]);

    useEffect(() => {}, [stories])
    
    return (
        <StoryContext.Provider
            value={{
                stories,
                currentIndex,
                currentStory,
                url,
                loading,
                error,
                selectUser,
                fetchStoryUrl,
                storiesSocket,
                selectStory
            }}
        >
            {children}
        </StoryContext.Provider>
    )

}

export const useStories = () => {
    return useContext(StoryContext);
};
