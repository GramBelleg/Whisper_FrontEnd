import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from '@/services/messagingservice/sockets/sockets'
import StorySocket from "@/services/sockets/StorySocket";
import { getStories } from "@/services/storiesservice/getStories";
import { downloadBlob } from "@/services/blobs/blob";
import { whoAmI } from "@/services/chatservice/whoAmI";
import { downloadLink, uploadLink } from "@/mocks/mockData";
import { uploadBlob } from "@/services/blobs/blob";


export const StoryContext = createContext();

export const StoriesProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentStory, setCurrentStory ] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [ stories, setStories ] = useState([]);
    const [ isUploading, setIsUploading] = useState(false);
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

    const loadUserStories = async () => {
        try {
            const data = await getStories(currentUser.id);
            setStories([...data]);
        } catch (error) {
            setStories([]);
            console.log(error);
        }
    };

    const handleRecieveStory = async (storyData) => {
        /*
        {
            "id": 0,
            "userId": 0,
            "content": "string",
            "media": "string",
            "date": "2019-08-24T14:15:22Z"
        }
        */
       if (storyData.userId === whoAmI.id) {
       }
        console.log(storyData);
    }

    const fetchStoryUrl = async () => {
        try {
            if(currentStory) {  
                console.log(currentStory)
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

    const uploadStory = async (newStory) => {
        setIsUploading(true);
        try {
            const blobName = await uploadBlob(file, uploadLink);
            if(blobName) {
                storiesSocket.sendData(newStory);
                setIsUploading(false);
            }
        } catch (error) {
            setIsUploading(false);
            setError(error.message);
        } 
    }

    useEffect(() => {
        if (currentUser) {
            loadUserStories();
            setCurrentIndex(0);
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
        if(storiesSocket) {
            storiesSocket.onReceiveStory(handleRecieveStory);
        }
    }, [storiesSocket]);

    useEffect(() => {
        if (stories) {
            setCurrentStory(stories[currentIndex]);
        }
    }, [stories])
    
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
