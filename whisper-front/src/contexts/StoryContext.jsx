import { createContext, useEffect, useRef } from "react";
import { socket } from '@/services/messagingservice/sockets/sockets'
import StorySocket from "@/services/sockets/StorySocket";

export const StoryContext = createContext();

export const storyProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentStory, setCurrentStory ] = useState(null);
    const [ stories, setStories ] = useState([]);
    const [uploading, setIsUploading] = useState(false);
    const storiesSocket = new StorySocket(socket);
    const currentUserRef = useRef();
    const currentStoryRef = useRef();

    const selectUser = (user) => {
        setCurrentUser(user);
    };

    const selectStory = (story) => {
        setCurrentStory(story);
    };

    const loadUserStories = async () => {
        try {
            const myStories = await db.getMessagesForChat(currentUser.id);
            setStories(myStories);
        } catch (error) {
            console.log(error);
        }
    }

    const uploadStory = async () => {
        // TODO: upload story
    }

    useEffect(() => {
        if (currentUser) {
            loadUserStories();
        } else {
            setStories([]);
            setCurrentStory(null);
        }
    }, [currentUser]);

    useEffect(() => {
        if(storiesSocket) {
            storiesSocket.onReceiveMessage(handleReceiveMessage);
            storiesSocket.onPinMessage(handlePinMessage);
            storiesSocket.onUnPinMessage(handleUnpinMessage);
        }
    }, [storiesSocket]);

    return (
        <StoryContext.Provider 
            value={{
                currentUser,
                setCurrentUser,
                currentStory,
                setCurrentStory
            }}
        >
            {children}
        </StoryContext.Provider>
    )

}

export const useStories = () => {
    return useContext(StoryContext);
};