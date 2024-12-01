import { createContext, useContext, useEffect, useRef, useState } from "react";
import StorySocket from "@/services/sockets/StorySocket";
import { getStories } from "@/services/storiesservice/getStories";
import { downloadBlob } from "@/services/blobs/blob";
import { downloadLink, uploadLink } from "@/mocks/mockData";
import { uploadBlob } from "@/services/blobs/blob";
import { useWhisperDB } from "./WhisperDBContext";
import { whoAmI } from "@/services/chatservice/whoAmI";
import { getUserInfo } from "@/services/userservices/getUserInfo";
import {  getStoryLikesAndViews } from "@/services/storiesservice/getLikesAndViews";

export const StoryContext = createContext();

export const StoriesProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentStory, setCurrentStory ] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [ stories, setStories ] = useState([]);
    const [storiesTab, setStoriesTab] = useState([])
    const [ isUploading, setIsUploading] = useState(false);
    const [ isDeleteing, setIsDeleteing] = useState(false);
    const [changedLikes, setChangedLikes] = useState(false);
    const [changedViews, setChangedViews] = useState(false);
    const storiesSocket = new StorySocket();
    const currentUserRef = useRef();
    const currentStoryRef = useRef();
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dbRef } = useWhisperDB();   

    const selectUser = (user) => {
        setCurrentUser(user);
    };

    const closeStories = () => {
        setCurrentStory(null);
        setCurrentIndex(null);
        setStories([]);
    }

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
        if (dbRef) {
            try {
                const data = await dbRef.current.getStories();
                setStoriesTab(data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const loadUserStories = async (id = null) => {
        let data;
        let userId = id || currentUser.userId;
        try {
            try { 
                const hasStories = await dbRef.current.userHasStories(userId);
                if (hasStories) {
                    data = await dbRef.current.getUserStories(userId);
                } else {
                    throw new Error('No stories found');
                }
            } catch (error) {
                console.log(error);
                data = await getStories(userId);
                console.log(data)
                await dbRef.current.insertUserStories(data, userId);
            } 
            
            setStories([...data]);
        } catch (error) {
            setStories([]);
            console.log(error);
        }
    };

    const handleRecieveStory = async (storyData) => {
        try {
            const {  iLiked, likes, iViewed, views } = await getStoryLikesAndViews(storyData.id);

            await dbRef.current.postStory({...storyData,
                likes: likes,
                views: views,
                liked: iLiked,
                viewed: iViewed
            });
            console.log(views)
            const userHasStories = await dbRef.current.userHasStories(storyData.userId);
            if (!userHasStories) {
                const data = await getUserInfo(storyData.userId);
                await dbRef.current.postUserStories(storyData, data);
                localGetStories();
            }
            if (storyData.userId === whoAmI.userId) {
                loadUserStories(whoAmI.userId);
                whoAmI.hasStory = true;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
        }   
    }

    const handleReceiveDeleteStory = async (storyData) => {
        try {
            await dbRef.current.deleteStory(storyData.storyId);
            try {
                const localStories = await dbRef.current.getUserStories(storyData.userId);
                if (localStories.length === 0) {
                    await dbRef.current.deleteUserFromStories(storyData.userId);
                    localGetStories();
                    if (whoAmI.userId === storyData.userId) {
                        whoAmI.hasStory = false;
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
            if (stories && whoAmI.userId === storyData.userId) {
                loadUserStories(whoAmI.userId);
            }
    
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteStory = async () => {
        try {
            setIsDeleteing(true);
            if (stories) {
                storiesSocket.deleteData(stories[currentIndex].id);
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsDeleteing(false);
        }
    } 
    
    const handleRecieveLikeStory = async (storyData) => {
        try {
            await dbRef.current.loadLikes(storyData.storyId, 0, true);
            if (storyData.userId === whoAmI.userId ) {
                await dbRef.current.iLiked(storyData.storyId, true);
            }
        } catch (error) {
            console.log(error);
        } 
    }

    const handleRecieveViewStory = async (storyData) => {
        try {
            setChangedViews(true);
            console.log(stories)
            if (storyData.userId === whoAmI.userId ) {
                try {
                    if (dbRef) {
                        await dbRef.current.iViewed(storyData.storyId, true);
                    }
                    if (dbRef) {
                        await dbRef.current.loadViews(storyData.storyId, 0, true);
                    }
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setChangedViews(false);
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


    const reloadSingleStory = async (storyId) => {
        try {
            const story = await dbRef.current.getStory(storyId);
            if (story) {
                setCurrentStory(story);
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    const sendLikeStory = async () => {
        console.log(stories)
        try {
            if(currentStory) {
                let liked = true;
                try {
                    liked = await dbRef.current.isLiked(currentStory.id);
                    if (!liked) {
                        storiesSocket.likeStory({
                            storyId: currentStory.id,
                            userName: whoAmI.userName,
                            profilePic: whoAmI.profilePic,
                            liked: true
                        });
                    }
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const sendViewStory = async () => {
        console.log("eh", stories)
        try {
            if(currentStory) {
                let viewed = true;
                try {
                    viewed = await dbRef.current.isViewed(currentStory.id);
                    if (!viewed) {
                        storiesSocket.viewStory({
                            storyId: currentStory.id,
                            userName: whoAmI.userName,
                            profilePic: whoAmI.profilePic,
                        });
                    }
                } catch (error) {
                    throw error;
                }
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser)
            loadUserStories();
        } else {
            console.log("no user")
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
                try {
                    fetchStoryUrl();
                } catch (error) {
                    throw error;
                }
                sendViewStory();
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [currentStory]);

    useEffect(() => {
        if(storiesSocket) {
            storiesSocket.onReceiveStory(handleRecieveStory);
            storiesSocket.onReceiveDeleteStory(handleReceiveDeleteStory);
            storiesSocket.onReceiveLikeStory(handleRecieveLikeStory);
            storiesSocket.onReceiveViewStory(handleRecieveViewStory);
        }
    }, [storiesSocket]);
    
    useEffect(() => {
        console.log("hey", stories)
        if (stories) {
            setCurrentIndex(0);
            setCurrentStory(stories[0]);
        } else {
            setCurrentStory(null);
        }
    }, [stories])

    useEffect(() => {
        localGetStories();
    }, [dbRef, localGetStories]);

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
                isDeleteing,
                storiesTab,
                changedLikes,
                changedViews,
                selectUser,
                fetchStoryUrl,
                sendLikeStory,
                sendViewStory,
                uploadStory,
                handleDeleteStory,
                
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