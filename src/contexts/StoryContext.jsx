import { createContext, useContext, useEffect, useRef, useState } from 'react'
import StorySocket from '@/services/sockets/StorySocket'
import { getStories } from '@/services/storiesservice/getStories'
import { downloadBlob } from '@/services/blobs/blob'
import { useWhisperDB } from './WhisperDBContext'
import { getUserInfo } from '@/services/userservices/getUserInfo'
import { getStoryLikesAndViews } from '@/services/storiesservice/getLikesAndViews'
import { readMedia, uploadMedia } from '@/services/chatservice/media'
import useAuth from '@/hooks/useAuth'

export const StoryContext = createContext()

export const StoriesProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [currentStory, setCurrentStory] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [stories, setStories] = useState([])
    const [storiesTab, setStoriesTab] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleteing, setIsDeleteing] = useState(false)
    const [changedLikes, setChangedLikes] = useState(false)
    const [changedViews, setChangedViews] = useState(false)
    const storiesSocketRef = useRef()
    const currentUserRef = useRef()
    const currentStoryRef = useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { dbRef } = useWhisperDB()
    const { user, handleUpdateUser } = useAuth()
    const [appLoaded, setAppLoaded] = useState(false)

    const selectUser = async (userIn) => {
        setCurrentUser(userIn)
        if (currentUser) {
            await loadUserStories(userIn.userId)
        }
    }

    const selectStory = (next) => {
        if (stories) {
            setCurrentIndex((prevIndex) =>
                next ? (prevIndex < stories.length - 1 ? prevIndex + 1 : 0) : prevIndex > 0 ? prevIndex - 1 : stories.length - 1
            )
        }
    }

    const localGetStories = async () => {
        if (dbRef && dbRef.current) {
            try {
                const data = await dbRef.current.getStories()
                setStoriesTab([...data])
            } catch (error) {
                setStoriesTab([])
                console.log(error)
            }
        }
    }

    const loadUserStories = async (id = null) => {
        let data
        let userId = id || currentUserRef.current.userId
        try {
            try {
                const hasStories = await dbRef.current.userHasStories(userId)
                if (hasStories) {
                    data = await dbRef.current.getUserStories(userId)
                    console.log(data)
                    setStories([...data])
                } 
            } catch (error) {
                console.log(error)
            }
            
        } catch (error) {
            setStories([])
            console.log(error)
        }
    }

    const handleRecieveStory = async (storyData) => {
        try {
            console.log(storyData)
            const { iLiked, likes, iViewed, views } = await getStoryLikesAndViews(storyData.id)
            try {
                await dbRef.current.postStory({ ...storyData, likes: likes, views: views, liked: iLiked, viewed: iViewed })
            } catch (error) {
                console.log(error)
            }
            const userHasStories = await dbRef.current.userHasStories(storyData.userId)
            if (!userHasStories) {
                const data = await getUserInfo(storyData.userId)
                await dbRef.current.postUserStories(storyData, data)
                localGetStories()
            }
            if (storyData.userId === user.id) {
                loadUserStories(user.id)
                handleUpdateUser('hasStory', true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleReceiveDeleteStory = async (storyData) => {
        try {
            try {
                await dbRef.current.deleteStory(storyData.storyId)
            } catch (error) {
                console.log(error)  
            }
            try {
                const localStories = await dbRef.current.getUserStories(storyData.userId)
                if (localStories.length === 0) {
                    try {
                        await dbRef.current.deleteUserFromStories(storyData.userId)
                    } catch (error) {
                        console.log(error)
                    }
                    localGetStories()
                    if (user.userId === storyData.userId) {
                        handleUpdateUser('hasStory', false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
            if (stories && user.userId === storyData.userId) {
                loadUserStories(user.userId)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteStory = async () => {
        try {
            setIsDeleteing(true)
            if (stories) {
                storiesSocketRef.current.deleteData(stories[currentIndex].id)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsDeleteing(false)
        }
    }

    const handleRecieveLikeStory = async (storyData) => {
        try {
            await dbRef.current.loadLikes(storyData.storyId, 0, true)
            if (storyData.userId === user.userId) {
                await dbRef.current.iLiked(storyData.storyId, true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRecieveViewStory = async (storyData) => {
        try {
            setChangedViews(true)

            if (storyData.userId === user.id) {
                try {
                    if (dbRef) {
                        await dbRef.current.iViewed(storyData.storyId, true)
                    }
                    if (dbRef) {
                        await dbRef.current.loadViews(storyData.storyId, 0, true)
                    }
                } catch (error) {
                    throw error
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setChangedViews(false)
        }
    }

    const uploadStory = async (file, newStory) => {
        setIsUploading(true)
        try {
            const blobName = await uploadMedia({
                file: file,
                extension: newStory.type
            })
            if (blobName) {
                const storyToSend = {
                    content: newStory.content,
                    media: blobName,
                    type: newStory.type
                }
                console.log(storyToSend)
                storiesSocketRef.current.sendData(storyToSend)
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const sendLikeStory = async () => {
        try {
            if (currentStory) {
                let liked = true
                try {
                    liked = await dbRef.current.isLiked(currentStory.id)
                    if (!liked) {
                        storiesSocketRef.current.likeStory({
                            storyId: currentStory.id,
                            userName: user.userName,
                            profilePic: user.profilePic,
                            liked: true
                        })
                    }
                } catch (error) {
                    throw error
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const sendViewStory = async () => {
        try {
            if (currentStory) {
                let viewed = true
                try {
                    viewed = await dbRef.current.isViewed(currentStory.id)
                    if (!viewed) {
                        storiesSocketRef.current.viewStory({
                            storyId: currentStory.id,
                            userName: user.userName,
                            profilePic: user.profilePic
                        })
                    }
                } catch (error) {
                    throw error
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        currentUserRef.current = currentUser
        if (currentUser) {
            loadUserStories()
        } else {
            setStories([])
        }
        
    }, [currentUser])

    useEffect(() => {
        const fetchStoryUrl = async () => {
            try {
                if (currentStory && currentStory.blob) {
                    const objectUrl = URL.createObjectURL(currentStory.blob)
                    currentStory.url = objectUrl
                }
                if (currentStory && !currentStory.url) {
                    const presignedUrl = await readMedia(currentStory.media)
                    const { blob } = await downloadBlob({ presignedUrl: presignedUrl })
                    const newBlob = new Blob([blob], { type: currentStory.type })
                    const objectUrl = URL.createObjectURL(newBlob)
                    await dbRef.current.addStoryBlob(currentStory.id, newBlob)
                    currentStory.url = objectUrl
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (currentStory) {
            currentStoryRef.current = currentStory
            setLoading(true)
            setError(null)
            try {
                fetchStoryUrl()
                sendViewStory()
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }   
        }
    }, [currentStory])

    useEffect(() => {
        if(user) {
            storiesSocketRef.current = new StorySocket()
        }
    }, [user])

    useEffect(() => {
        if (storiesSocketRef.current) {
            storiesSocketRef.current.onReceiveStory(handleRecieveStory)
            storiesSocketRef.current.onReceiveDeleteStory(handleReceiveDeleteStory)
            storiesSocketRef.current.onReceiveLikeStory(handleRecieveLikeStory)
            storiesSocketRef.current.onReceiveViewStory(handleRecieveViewStory)
        }

        return () => {
            storiesSocketRef.current.offReceiveStory(handleRecieveStory)
            storiesSocketRef.current.offRecieveDeleteStory(handleReceiveDeleteStory)
            storiesSocketRef.current.offReceiveLikeStory(handleRecieveLikeStory)
            storiesSocketRef.current.offReceiveViewStory(handleRecieveViewStory)
        }

    }, [storiesSocketRef.current])

    useEffect(() => {
        if (stories) {
            setCurrentIndex(0)
            setCurrentStory(stories[0])
        } else {
            setCurrentStory(null)
        }
    }, [stories])

    useEffect(() => {
        localGetStories()
        setAppLoaded(false)
    }, [dbRef, appLoaded])

    useEffect(() => {
        if (currentIndex > -1 && stories) {
            setCurrentStory(stories[currentIndex])
        }
    }, [currentIndex])

    useEffect(() => {console.log(user)}, [user, loading])

    return (
        <StoryContext.Provider
            value={{
                stories,
                currentIndex,
                currentStory,
                loading,
                error,
                currentUser,
                isUploading,
                isDeleteing,
                storiesTab,
                changedLikes,
                changedViews,
                selectUser,
                sendLikeStory,
                sendViewStory,
                uploadStory,
                handleDeleteStory,
                selectStory,
                appLoaded,
                setAppLoaded
            }}
        >
            {children}
        </StoryContext.Provider>
    )
}

export const useStories = () => {
    return useContext(StoryContext)
}
