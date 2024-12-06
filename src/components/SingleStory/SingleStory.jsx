import { useEffect, useRef, useState } from 'react'
import './SingleStory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faEye, faPause, faPlay, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import { setStoryPrivacySettings } from '@/services/storiesservice/setStoryVisibility'
import { useStories } from '@/contexts/StoryContext'
import useAuth from '@/hooks/useAuth'

const SingleStory = ({ onNextStory, handleAddNewStoryClick, onClose }) => {
    const { loading, error, currentStory, currentUser, isDeleteing, handleDeleteStory, sendLikeStory } = useStories()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [visibilityDropDownVisible, setVisibilityDropDownVisible] = useState(false)
    const [storyVisibility, setStoryVisibility] = useState('Everyone')
    const [isPaused, setIsPaused] = useState(false)
    const storyVisibilityChangedRef = useRef(false)
    const videoRef = useRef()
    const intervalRef = useRef(null)
    const startTimeRef = useRef(Date.now())
    const dropdownRef = useRef(null)
    const { openModal, closeModal } = useModal()
    const [remainingTime, setRemainingTime] = useState(20000)
    const { user } = useAuth();

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.within-story-visibility')) {
            setDropdownVisible(false)
            setVisibilityDropDownVisible(false)
            startInterval()
            setRemainingTime(20000)

            if (storyVisibilityChangedRef.current === true) {
                try {
                    setStoryPrivacySettings(currentStory?.id, storyVisibility)
                } catch (error) {
                    openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
                    setTimeout(() => {
                        onClose()
                    }, 3000)
                }
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        setDropdownVisible(false)
        setVisibilityDropDownVisible(false)
        setRemainingTime(20000)
        startInterval()
        storyVisibilityChangedRef.current = false
        dropdownRef.current = null
        videoRef.current = null
        return () => {
            clearTimeout(intervalRef.current)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [currentStory, currentStory?.url])

    useEffect(() => {}, [currentUser])

    useEffect(() => {}, [currentUser, currentStory?.liked, currentStory?.url])

    useEffect(() => {
        if (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setTimeout(() => {
                onClose()
            }, 3000)
        }
    }, [error])

    useEffect(() => {}, [isDeleteing])

    const localHandleDeleteStory = () => {
        clearTimeout(intervalRef.current)
        handleDeleteStory()
    }

    const startInterval = () => {
        intervalRef.current = setTimeout(() => {
            onNextStory()
        }, remainingTime)

        startTimeRef.current = Date.now()
        setIsPaused(false)
    }

    const pauseInterval = () => {
        clearTimeout(intervalRef.current)
        const elapsedTime = Date.now() - startTimeRef.current
        setRemainingTime((prev) => prev - elapsedTime)
        setIsPaused(true)
    }

    const handleDropdownToggle = () => {
        setDropdownVisible((visible) => {
            if (!visible) {
                pauseInterval()
            } else {
                startInterval()
            }
            return !visible
        })
    }

    const handleEditVisibility = () => {
        setDropdownVisible(false)
        setVisibilityDropDownVisible(true)
    }

    const handleVisibilityChange = (value) => {
        setStoryVisibility(value)
        storyVisibilityChangedRef.current = true
    }

    const renderContent = () => {
        if (loading || isDeleteing) {
            return (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
                </div>
            )
        }
        if (error) {
            return <div className='flex items-center justify-center w-full h-full text-red-500'>Error: {error}</div>
        }

        if (currentStory && currentStory.url && currentStory?.type.startsWith('image/')) {
            return (
                <img
                    src={currentStory.url}
                    alt='Story content'
                    className='w-full h-full object-contain'
                    onError={() => console.log('Failed to load image')}
                />
            )
        }
        if (currentStory && currentStory.url && currentStory?.type.startsWith('video/')) {
            return (
                <video ref={videoRef} autoPlay className='w-full h-full object-contain'>
                    <source src={currentStory.url} type={currentStory.type} onError={() => console.log("Error")} />
                    Your browser does not support this video format.
                </video>
            )
        }
    }

    return (
        <>
            <div className='story-controls'>
                <button onClick={isPaused ? startInterval : pauseInterval} className='control-button' aria-label='Pause'>
                    <FontAwesomeIcon icon={isPaused ? faPlay : faPause} className='h-8 w-8' />
                </button>

                {currentUser?.userId === user.id && (
                    <div className='dropdown-container'>
                        <button onClick={handleDropdownToggle} className='three-dots-button' aria-label='Options'>
                            <FontAwesomeIcon icon={faEllipsisV} className='h-8 w-8' />
                        </button>
                        {dropdownVisible && (
                            <div className='dropdown-menu'>
                                <button onClick={handleAddNewStoryClick} className='dropdown-item add'>
                                    Add
                                </button>
                                <button onClick={localHandleDeleteStory} className='dropdown-item delete'>
                                    Delete
                                </button>
                                <div className='edit-visibility-within-story'>
                                    <FontAwesomeIcon icon={faEye} />
                                    <button onClick={handleEditVisibility} className='dropdown-item visibility'>
                                        Who Can See My Story?
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {visibilityDropDownVisible && (
                <div className='within-story-visibility' ref={dropdownRef}>
                    <label>
                        <input
                            type='radio'
                            value='Everyone'
                            checked={storyVisibility === 'Everyone'}
                            onChange={() => {
                                handleVisibilityChange('Everyone')
                            }}
                        />
                        Everyone
                    </label>
                    <label>
                        <input
                            type='radio'
                            value='Contacts'
                            checked={storyVisibility === 'Contacts'}
                            onChange={() => {
                                handleVisibilityChange('Contacts')
                            }}
                        />
                        My Contacts
                    </label>
                    <label>
                        <input
                            type='radio'
                            value='Nobody'
                            checked={storyVisibility === 'Nobody'}
                            onChange={() => {
                                handleVisibilityChange('Nobody')
                            }}
                        />
                        No One
                    </label>
                </div>
            )}

            {renderContent()}
            <div className='story-content'>
                <div className={`likes ${currentStory?.liked ? 'liked' : ''}`}>
                    <FontAwesomeIcon
                        icon={faHeart}
                        className='h-6 w-6'
                        onClick={
                            currentStory && !currentStory.liked
                                ? sendLikeStory
                                : () => {
                                      console.log('ho')
                                  }
                        }
                    />
                    <span className='likes-count'>{currentStory?.likes}</span>
                </div>

                {currentStory?.userId === user.id && (
                    <div className='views'>
                        <FontAwesomeIcon icon={faEye} className='h-6 w-6' />
                        <span className='views-count'>{currentStory?.views}</span>
                    </div>
                )}
                <div className='story-content-text'>{currentStory?.content}</div>
            </div>
        </>
    )
}

export default SingleStory
