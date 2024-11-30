import StoriesTab from './StoriesTab';
import React, { useRef, useState, useEffect } from "react";
import useFetch from '../../services/useFetch';
import { useModal } from '@/contexts/ModalContext';
import { getMyStories, getUsersWithStoriesCleaned } from '@/services/storiesservice/getStories';
import MyStoriesList from '../MyStoriesList/MyStoriesList';
import AddNewStoryModal from '../AddNewStoryModal/AddNewStoryModal';

export default function StoriesContainer() {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [myStories, setMyStories] = useState([]);
    const [userStories, setUserStories] = useState([])

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
            setMyStories(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMyStories();
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
                    onStoryAdded={fetchMyStories}
                />)
        }
    }
    const handleMyStoryClick = (file, filePreview) => {
        if (myStories.length > 0) {
            openModal(<MyStoriesList 
                        incomingStories={myStories} 
                        onClose={closeModal} 
                        handleAddStory={handleAddStory}
                        handleDeleteStory={fetchMyStories}
                    />);
        } else {   
            handleAddStory(file, filePreview);
            
        }
    };

   
    // const { data, error, loading } = useFetch('/stories'); TODO: handle others stories

    const getStories = async () => {
        try {
            const data = await getUsersWithStoriesCleaned();
            setUserStories(data);
            console.log(data)
        } catch (error) {

        }
    }
    return (
            <StoriesTab
                error={new Error("")}
                loading={false}
                stories={userStories}
                showLeftArrow={showLeftArrow}
                showRightArrow={showRightArrow}
                scrollContainerRef={scrollContainerRef}
                scrollLeft={scrollLeft}
                scrollRight={scrollRight}
                handleMyStoryClick={handleMyStoryClick}
                myStoriesLength={myStories?.length}
            />
    );
}
