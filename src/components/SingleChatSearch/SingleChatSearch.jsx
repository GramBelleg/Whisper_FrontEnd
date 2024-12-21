import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';
import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SingleChatSearch = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState([]);
    const { push } = useStackedNavigation();

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const toggleFilter = (filterType) => {
        setFilters((prevFilters) =>
            prevFilters.includes(filterType)
                ? prevFilters.filter((filter) => filter !== filterType)
                : [...prevFilters, filterType]
        );
    };

    const handleOnSearch = () => {
        //TODO
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`fixed top-[2.5%] right-[4.5%] w-80 h-[100%] bg-dark text-light shadow-lg z-200 p-4 transition-transform transform ${
                isVisible ? 'translate-x-0' : 'translate-x-[200%]'
            }`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Chat Search</h3>
                <div className="flex justify-between items-center space-x-4">
                    <button className="text-white" onClick={handleClose} data-testid="close-button">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
            <div className="mb-6">
                <SearchBar searchQuery={query} setSearchQuery={setQuery} onEnter={handleOnSearch} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <button
                    className={`px-4 py-2 rounded ${
                        filters.includes('text') ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => toggleFilter('text')}
                >
                    Text
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filters.includes('photo') ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => toggleFilter('photo')}
                >
                    Photo
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filters.includes('video') ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => toggleFilter('video')}
                >
                    Video
                </button>
            </div>
            <div className="border-t border-gray-600 pt-4">
                No Results
            </div>
        </div>
    );
};

export default SingleChatSearch;
