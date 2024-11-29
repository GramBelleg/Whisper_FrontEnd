import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';

const SearchSingleChat = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const {searchChat} = useChat();
  const onSearch= async (searchText) => {
    try {
      const results = await searchChat(searchText);
      setSearchResults(results);
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  }
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsDropdownVisible(true);
      onSearch(e.target.value);
    } else {
      setIsDropdownVisible(false);
    }
  };

  return (
    <div className="relative flex items-center">
      {showSearchBar && (
        <div className="absolute left-0 transform -translate-x-full w-full sm:w-80 shadow-lg rounded-md p-2 z-10">
          <SearchBar handleQueryChange={handleQueryChange} />
          {isDropdownVisible && searchResults && searchResults.length > 0 && (
            <ul className="absolute left-0 mt-2 w-full bg-dark shadow-lg rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-secondary-dark hover:text-light cursor-pointer"
                  onClick={() => {
                    console.log(`Selected: ${result}`);
                  }}
                >
                  {result.content}
                </li>
              ))}
            </ul>
          )}
          {((isDropdownVisible && searchResults && searchResults.length === 0)||
           (!searchResults && query.length>0)) && 
           (
            <div className="absolute left-0 mt-2 w-full bg-dark shadow-lg rounded-md p-4 text-center text-gray-500">
              No results found.
            </div>
          )}
        </div>
      )}
      {
        !showSearchBar ? (
      <FontAwesomeIcon
        className="icon cursor-pointer text-primary hover:text-primary"
        style={{ height: '24px' }}
        icon={faSearch}
        onClick={() => {
          setShowSearchBar(!showSearchBar);
          setIsDropdownVisible(false); 
        }}
      />
    ) : <FontAwesomeIcon 
    className="icon cursor-pointer text-primary hover:text-primary"
    style={{ height: '24px' }} icon={faClose} 
    onClick={() => setShowSearchBar(!showSearchBar)}
    />
}
    </div>
  );
};

export default SearchSingleChat;
