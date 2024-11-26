import StoriesTab from './StoriesTab';
import React, { useRef, useState, useEffect } from "react";
import { useModal } from '@/contexts/ModalContext';
import StoriesList from '../StoriesList/StoriesList';
import AddNewStoryModal from '../AddNewStoryModal/AddNewStoryModal';
import { getUsersWithStoriesCleaned } from '@/services/storiesservice/getStories';
import { useStories } from '@/contexts/StoryContext';

export default function StoriesContainer() {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [userStories, setUserStories] = useState([])
    const { openModal, closeModal } = useModal();
    const { selectUser, stories } = useStories();
    
    const getStories = async () => {
        try {
            const data = await getUsersWithStoriesCleaned();
            setUserStories(data);
            console.log("Getting stories", data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        getStories();
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleAddStory = (file, filePreview) => {
        if(file) {
            openModal(
                <AddNewStoryModal 
                    file={file} 
                    filePreview={filePreview} 
                    onClose={closeModal}
                    onStoryAdded={() => {}}
                />
            );
        }
    }

    const handleStoryClick = (user, file = null, filePreview = null) => {
        if (!file) {   
            selectUser(user);
            openModal(
                <StoriesList
                    onClose={closeModal}
                    handleAddStory={handleAddStory}
                    handleDeleteStory={() => {}}
                />
            );
        } else {   
            handleAddStory(file, filePreview);
        }
    };

    useEffect(() => {}, [stories]);
   
    return (
            <StoriesTab
                error={null}
                loading={false}
                stories={userStories}
                showLeftArrow={showLeftArrow}
                showRightArrow={showRightArrow}
                scrollContainerRef={scrollContainerRef}
                scrollLeft={scrollLeft}
                scrollRight={scrollRight}
                handleStoryClick={handleStoryClick}
            />
    );
}
