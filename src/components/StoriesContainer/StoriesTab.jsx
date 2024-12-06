import RightArrow from '../../assets/images/arrow-right.svg?react'
import LeftArrow from '../../assets/images/arrow-left.svg?react'
import './StoriesTab.css'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import { useModal } from '@/contexts/ModalContext'
import useAuth from '@/hooks/useAuth'

const StoriesTab = ({
    loading,
    error,
    stories,
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
    handleStoryClick
}) => {
    const { openModal, closeModal } = useModal()
    const [firstError, setFirstError] = useState(true)
    const fileInputRef = useRef(null)
    const { user } = useAuth();

    useEffect(() => {
        console.log(user.hasStory)
    }, [user])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        if (firstError) {
            openModal(<ErrorMesssage errorMessage={'Failed to fetch stories'} onClose={closeModal} appearFor={3000} />)
            setTimeout(() => {}, 3000)
            setFirstError(false)
        }
    }

    const handlePlusIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            const filePreview = URL.createObjectURL(file)
            handleStoryClick(user, file, filePreview)
        } else {
            console.log('No valid file selected')
        }
    }

    return (
        <div className='stories-container'>
            <div className='stories-wrapper'>
                <div className='stories-scroll' ref={scrollContainerRef}>
                    <ul className='stories-list'>
                        {showLeftArrow && <LeftArrow onClick={scrollLeft} className='arrow-button prev' />}
                        <li key={1} className='story-item' onClick={() => handleStoryClick(user)}>
                            <div className='profile-picture-container'>
                                <div className={`profile-picture ${false ? '' : 'unseen'}`}>
                                    <img src={user.profilePic} alt={`${user.name}'s profile`} />
                                </div>
                                {!user.hasStory && (
                                    <div className='plus-icon-container' onClick={handlePlusIconClick}>
                                        <FontAwesomeIcon icon={faPlus} className='plus-icon' />
                                    </div>
                                )}
                            </div>
                            <span className='story-user'>{user.userName}</span>
                        </li>

                        {stories?.map(
                            (story) =>
                                story.userId !== user.id && (
                                    <li key={story.userId} className='story-item' onClick={() => handleStoryClick(story)}>
                                        <div className={`profile-picture unseen`}>
                                            <img src={story.profilePic} alt={`${story.userName}'s profile`} />
                                        </div>
                                        <span className='story-user'>{story.userName}</span>
                                    </li>
                                )
                        )}

                        {showRightArrow && <RightArrow onClick={scrollRight} className='arrow-button next' />}
                    </ul>
                </div>
            </div>

            {/* Hidden file input */}
            <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
    )
}

export default StoriesTab
