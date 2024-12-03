import React from 'react'
import Search from '../../assets/images/search.svg?react'
import './SearchBar.css'
const SearchBar = ({ handleQueryChange, handleSearchClick }) => {
    return (
        <div className='search-bar'>
            <Search data-testid='search-bar-test' className='search-icon cursor-pointer' onClick={handleSearchClick} />
            <input type='text' placeholder='Search' data-testid='search-input-test' className='search-input' onChange={handleQueryChange} />
        </div>
    )
}

export default SearchBar
