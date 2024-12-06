import StoriesTab from './StoriesTab'
import React, { useRef, useState, useEffect } from 'react'
import { useModal } from '@/contexts/ModalContext'
import StoriesList from '../StoriesList/StoriesList'
import AddNewStoryModal from '../AddNewStoryModal/AddNewStoryModal'
import { useStories } from '@/contexts/StoryContext'
import useAuth from '@/hooks/useAuth'

export default function StoriesContainer() {
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const { openModal, closeModal } = useModal()
    const { selectUser, stories, storiesTab } = useStories()
    const { user } = useAuth()

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setShowLeftArrow(scrollLeft > 0)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
        }
    }

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll)
            return () => scrollContainer.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
        }
    }

    const handleAddStory = (file, filePreview) => {
        if (file) {
            openModal(<AddNewStoryModal file={file} filePreview={filePreview} onClose={closeModal} />)
        }
    }

    const handleStoryClick = (user, file = null, filePreview = null) => {
        if (!file) {
            selectUser(user)
            if ((user.userId === user.id && user.hasStory) || user.userId !== user.userId) {
                openModal(<StoriesList onClose={closeModal} handleAddStory={handleAddStory} />)
            }
        } else {
            handleAddStory(file, filePreview)
        }
    }

    useEffect(() => {}, [stories, storiesTab])

    return (
        <StoriesTab
            error={null}
            loading={false}
            stories={storiesTab}
            showLeftArrow={showLeftArrow}
            showRightArrow={showRightArrow}
            scrollContainerRef={scrollContainerRef}
            scrollLeft={scrollLeft}
            scrollRight={scrollRight}
            handleStoryClick={handleStoryClick}
        />
    )
}
