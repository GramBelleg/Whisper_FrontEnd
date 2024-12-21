import React, { useState } from 'react';
import Search from '../../assets/images/search.svg?react';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, onEnter }) => {
    
    
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onEnter(); 
        }
    };

    return (
        <div className='search-bar' style={{
                height: "100%",
                width: "100%",                
            }}>
            <Search data-testid='search-bar-test' className='search-icon cursor-pointer' />
            <input 
                type='text' 
                placeholder='Search' 
                data-testid='search-input-test' 
                className='search-input' 
                value={searchQuery} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} 
            />
        </div>
    );
};

export default SearchBar;
