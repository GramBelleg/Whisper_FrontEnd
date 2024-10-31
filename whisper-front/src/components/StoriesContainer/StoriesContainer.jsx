import StoriesTab from './StoriesTab';
import React, { useRef, useState, useEffect } from "react";
import useFetch from '../../services/useFetch';


export default function StoriesContainer() {

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

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

    const handleStoryClick = (user) => {
        console.log(`${user}'s story`);
    };

    const { data, error, loading } = useFetch('/stories');
    return <StoriesTab error={error} loading={loading} data={data} showLeftArrow={showLeftArrow} showRightArrow={showRightArrow} scrollContainerRef={scrollContainerRef} scrollLeft={scrollLeft} scrollRight={scrollRight} handleStoryClick={handleStoryClick} />;
}
