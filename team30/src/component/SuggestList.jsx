import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {
  getFollowings, getfollowsuggest, processsuggest, processfollow,
} from '../api/mock_api';
import '../Pages/Activity.css';

function SuggestList({ uid, showfollower }) {
  const [itemData, setitemData] = useState([]);
  useEffect(() => {
    if (!showfollower) {
      getfollowsuggest(uid).then((res) => processsuggest(uid, res)).then((res) => setitemData(res));
    } else {
      getFollowings(uid).then((res) => processfollow(uid, res)).then((res) => setitemData(res));
    }
  }, []);
  return (
    <div className="container">
      {
      (!showfollower)
        ? (
          <h1 className="display-6 text-light text-left mt-5 mb-3">
            You may want to follow...
          </h1>
        )
        : (
          <h1 className="text-light mt-5 mb-3">
            Your followings:

          </h1>
        )
}
      <div className="example-5 square scrollbar-dusty-grass square thins mb-1">
        <ImageList>
          <ImageListItem cols={200} />
          {itemData.length > 0 && itemData.map((item) => (
            <ImageListItem key={item._id}>
              <a href={`http://localhost:3000/profile/${item._id}`}>
                <img
                  className="mb-1 rounded-circle border border-warning border-3"
                  src={`${item.uavatar}?w=350&fit=crop&auto=format`}
                  srcSet={`${item.uavatar}?w=350&fit=crop&auto=format`}
                  style={{
                    width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '50%',
                  }}
                  alt=" "
                  loading="lazy"
                />
                <h6 className="text-light">{item.name}</h6>
              </a>
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
}

SuggestList.propTypes = {
  uid: PropTypes.string.isRequired,
}.isRequired;

export default SuggestList;
