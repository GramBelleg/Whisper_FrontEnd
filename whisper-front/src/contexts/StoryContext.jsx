import { createContext, useContext, useEffect, useRef, useState } from "react";
import StorySocket from "@/services/sockets/StorySocket";
import { getStories } from "@/services/storiesservice/getStories";
import { downloadBlob } from "@/services/blobs/blob";
import { downloadLink, uploadLink } from "@/mocks/mockData";
import { uploadBlob } from "@/services/blobs/blob";
import { useWhisperDB } from "./WhisperDBContext";
import { whoAmI } from "@/services/chatservice/whoAmI";

export const StoryContext = createContext();

export const StoriesProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentStory, setCurrentStory ] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [ stories, setStories ] = useState([]);
    const [storiesTab, setStoriesTab] = useState([])
    const [ isUploading, setIsUploading] = useState(false);
    const storiesSocket = new StorySocket();
    const currentUserRef = useRef();
    const currentStoryRef = useRef();
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { db } = useWhisperDB();   

    const selectUser = (user) => {
        setCurrentUser(user);
    };

    const selectStory = (next) => {
        if (stories) {
            setCurrentIndex((prevIndex) =>
                    next
                        ? (prevIndex < stories.length - 1 ? prevIndex + 1 : 0)
                        : (prevIndex > 0 ? prevIndex - 1 : stories.length - 1)
            );
        }
    };

    const localGetStories = async () => {
        if (db) {
            try {
                const data = await db.getStories();
                setStoriesTab(data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const loadUserStories = async (id = null) => {
        let data;
        let userId = id || currentUser.id;
        try {
            try {
                
                data = await db.getUserStories(userId);
            } catch (error) {
                console.log(error);
                data = await getStories(userId);
                await db.insertUserStories(data, userId);
            } 
            console.log(data)
            setStories([...data]);
        } catch (error) {
            setStories([]);
            console.log(error);
        }
    };

    const handleRecieveStory = async (storyData) => {
        try {
            await db.postStory(storyData);
            const userHasStories = await db.userHasStories(storyData.userId);
            if (!userHasStories) {
                await db.postUserStories(storyData);
            }
            if (storyData.userId === whoAmI.id) {
                loadUserStories(whoAmI.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
        }
    }

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
            console.log(error)
        }
    };

    const uploadStory = async (file, newStory) => {
        setIsUploading(true);
        try {
            const blobName = await uploadBlob(file, uploadLink);
            if(blobName) {
                storiesSocket.sendData(newStory);
            }
        } catch (error) {
            setIsUploading(false);
            console.log(error);
            setError(error.message);
        } 
    }

    useEffect(() => {
        if (currentUser) {
            loadUserStories();
        } else {
            setStories([]);
        }
        currentUserRef.current = currentUser;
    }, [currentUser]);

    useEffect(() => { 
        if (currentStory) {
            currentStoryRef.current = currentStory;
            setLoading(true);
            setError(null);
            try {
                fetchStoryUrl();
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
    }, [currentStory]);

    useEffect(() => {
        if(storiesSocket) {
            storiesSocket.onReceiveStory(handleRecieveStory);
        }
    }, [storiesSocket]);

    useEffect(() => {
        console.log(stories)
        if (stories) {
            setCurrentIndex(0);
            setCurrentStory(stories[0]);
        } else {
            setCurrentStory(null);
        }
    }, [stories])

    useEffect(() => {
        localGetStories();
    }, [db]);

    useEffect(() => {
        if (currentIndex > -1 && stories) {
            console.log(currentIndex)
            setCurrentStory(stories[currentIndex])
        }
    }, [currentIndex])
    
    return (
        <StoryContext.Provider
            value={{
                stories,
                currentIndex,
                currentStory,
                url,
                loading,
                error,
                currentUser,
                isUploading,
                storiesTab,
                selectUser,
                fetchStoryUrl,
                uploadStory,
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