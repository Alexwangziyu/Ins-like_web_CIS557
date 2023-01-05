import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
// import axios from 'axios';
import TopBar from '../component/TopBar';
import SearchBar from '../component/SearchBar';
import { getUsers } from '../api/mock_api';
import searchimg from './Component 2.png';
// import Userdata from '../MOCK_DATA.json';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

function Follow() {
  // const [itemData, setItemData] = useState([]);
  const [udata, setUdata] = useState([]);
  // useEffect(() => {
  //   axios.get('https://634623d5745bd0dbd377354a.mockapi.io/api/user')
  //     .then((res) => res.data)
  //     .then((data) => setItemData(data));
  // }, []);
  useEffect(() => {
    getUsers().then((res) => setUdata(res));
  }, []);
  return (
    <>
      <TopBar />
      <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ height: '10vh' }} />
        <img src={searchimg} alt="search" />
      </Stack>
      <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <SearchBar placeholder="Enter a user here" data={udata} />
      </Stack>

    </>
  );
}

export default Follow;
