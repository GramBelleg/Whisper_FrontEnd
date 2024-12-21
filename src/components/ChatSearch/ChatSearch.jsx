import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';
import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useChat } from '@/contexts/ChatContext';
import ChatMessage from '../ChatMessage/ChatMessage';
import { messagesLocalSearch } from '@/services/search/search';

const ChatSearch = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState(null);
    const [searchResults, setSearchResults] = useState(null)
    const { push } = useStackedNavigation();
    const { searchChat, currentChat } = useChat();

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };


    const handleGroupSearch = async () =>
    {
        let type;
        if(filter === "photo")
            type = "IMAGE"
        else if(filter === "video")
            type = "VIDEO"
        else
            type = "TEXT"
        const response = await messagesLocalSearch(currentChat.id,query,type)
    }

    const handleOnSearch = async () => {
        const results = await searchChat(query);
        console.log("search results", results);

        let filteredResults = results;
    
        if (filter === 'text') {
            filteredResults = results.filter(result => !result.extension); 
        } else if (filter === 'photo') {
            filteredResults = results.filter(result => result.extension?.split('/')[0] === 'image'); 
        }
        else if (filter === 'video')
        {
            filteredResults = results.filter(result => result.extension?.split('/')[0] === 'video'); 
        }

        setSearchResults(filteredResults)
        console.log("filtered results", filteredResults);
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
                <SearchBar 
                    searchQuery={query} 
                    setSearchQuery={setQuery} 
                    onEnter={currentChat.type === "DM"? handleOnSearch: handleGroupSearch} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <button
                    className={`px-4 py-2 rounded ${
                        filter === 'text' ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => setFilter('text')}
                >
                    Text
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filter === 'photo' ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => setFilter('photo')}
                >
                    Photo
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filter === 'video' ? 'bg-primary text-white' : 'bg-gray-600 text-gray-200'
                    }`}
                    onClick={() => setFilter('video')}
                >
                    Video
                </button>
            </div>
            <div className="border-t border-gray-600 pt-4">
                {searchResults && searchResults.length===0 &&
                <h3>No results found</h3>}
            <div className="search-results">
                {searchResults?.map((searchResult) => (
                    <div className="message-search-result" 
                        onClick={() => handleSearchMessageClick(searchResult)}>
                        <ChatMessage message={searchResult} hideActions={true} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default ChatSearch;
