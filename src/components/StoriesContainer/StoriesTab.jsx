import RightArrow from '../../assets/images/arrow-right.svg?react'
import LeftArrow from '../../assets/images/arrow-left.svg?react'
import './StoriesTab.css'
import { whoAmI } from '@/services/chatservice/whoAmI'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import { useModal } from '@/contexts/ModalContext'

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

    useEffect(() => {
        console.log(whoAmI.hasStory)
    }, [whoAmI.hasStory])

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
            handleStoryClick(whoAmI, file, filePreview)
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
                        <li key={1} className='story-item' onClick={() => handleStoryClick(whoAmI)}>
                            <div className='profile-picture-container'>
                                <div className={`profile-picture ${false ? '' : 'unseen'}`}>
                                    <img src={whoAmI.profilePic} alt={`${whoAmI.name}'s profile`} />
                                </div>
                                {!whoAmI.hasStory && (
                                    <div className='plus-icon-container' onClick={handlePlusIconClick}>
                                        <FontAwesomeIcon icon={faPlus} className='plus-icon' />
                                    </div>
                                )}
                            </div>
                            <span className='story-user'>{whoAmI.userName}</span>
                        </li>

                        {stories?.map(
                            (story) =>
                                story.userId !== whoAmI.userId && (
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
