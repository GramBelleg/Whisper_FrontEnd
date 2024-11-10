import StoriesTab from './StoriesTab';
import React, { useRef, useState, useEffect } from "react";
import useFetch from '../../services/useFetch';
import { useModal } from '@/contexts/ModalContext';
import { getMyStories } from '@/services/storiesservice/getStories';
import MyStoriesList from '../MyStoriesList/MyStoriesList';
import AddNewStoryModal from '../AddNewStoryModal/AddNewStoryModal';

export default function StoriesContainer() {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [stories, setStories] = useState([]);

    const { openModal, closeModal } = useModal();

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const fetchMyStories = async () => {
        try {
            const data = await getMyStories();
            console.log(data);
            setStories(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMyStories();
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
                    onStoryAdded={fetchMyStories}
                />)
        }
    }
    const handleMyStoryClick = (file, filePreview) => {
        if (stories.length > 0) {
            openModal(<MyStoriesList 
                        incomingStories={stories} 
                        onClose={closeModal} 
                        handleAddStory={handleAddStory}
                        handleDeleteStory={fetchMyStories}
                    />);
        } else {   
            handleAddStory(file, filePreview);
            
        }
    };

   
    const { data, error, loading } = useFetch('/stories');

    return (
            <StoriesTab
                error={error}
                loading={loading}
                data={data}
                showLeftArrow={showLeftArrow}
                showRightArrow={showRightArrow}
                scrollContainerRef={scrollContainerRef}
                scrollLeft={scrollLeft}
                scrollRight={scrollRight}
                handleMyStoryClick={handleMyStoryClick}
                myStoriesLength={stories?.length}
            />
    );
}
