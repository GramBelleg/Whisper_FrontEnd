import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';

const SearchSingleChat = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const onSearch= (searchText) => {
    console.log(searchText);
  }

  return (
    <div className="relative flex items-center">
      {showSearchBar && (
        <div className="absolute left-0 transform -translate-x-full w-full sm:w-80 shadow-lg rounded-md p-2">
          <SearchBar handleSearchClick={onSearch} />
        </div>
      )}
      <FontAwesomeIcon
        className="icon cursor-pointer text-primary hover:text-primary"
        style={{ height: '24px' }}
        icon={faSearch}
        onClick={() => setShowSearchBar(!showSearchBar)}
      />
    </div>
  );
};

export default SearchSingleChat;
