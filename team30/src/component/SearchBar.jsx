import React, { useState } from 'react';
import './SearchBar.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setwordEntered] = useState('');

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setwordEntered(searchWord);
    const newFilter = data.filter(
      (value) => value.name.toLowerCase().includes(searchWord.toLowerCase()),
    );
    if (searchWord === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
  const clearInput = () => {
    setFilteredData([]);
    setwordEntered('');
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input id="searchBar" type="text" placeholder={placeholder} value={wordEntered} onChange={handleFilter} />
        <div className="searchIcon">
          {
                filteredData.length === 0 ? <SearchIcon /> : <CloseIcon id="clearBtn" onClick={clearInput} />
}

        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
            {filteredData.slice(0, 15).map((value) => <a id="searchedUser" target="_self" className="dataItem" href={`/profile/${value._id}`} rel="noreferrer" key={value._id}><p>{value.name}</p></a>)}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  data: PropTypes.stringisRequired,
}.isRequired;

export default SearchBar;
