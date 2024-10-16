import React from 'react';
import Search from '../../assets/images/search.svg?react';
import './SearchBar.css'; 
const SearchBar = () => {
    const handleSearchClick = () => {
      console.log("will search");
    };
  
    return (
      <div className="search-bar">
        <Search className="search-icon" onClick={handleSearchClick}/>
        <input type="text" placeholder="Search" className="search-input" />
      </div>
    );
  };
  
  export default SearchBar;
