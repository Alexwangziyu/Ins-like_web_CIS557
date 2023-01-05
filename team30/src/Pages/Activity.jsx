/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState, useRef } from 'react';
// import '../main.css';
import './Activity.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
// import IconButton from '@mui/material/IconButton';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import axios from 'axios';
// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// import { useParams } from 'react-router-dom';
//  List, Avatar,
import Likebtn from '../component/Likebtn';
import TopBar from '../component/TopBar';
import SuggestList from '../component/SuggestList';
// import useActivity from './useActivity';
import {
  getUser, getUserID, getFollowings,
} from '../api/mock_api';
import { getPost } from '../backend/mock_api';
// import { getPostsbyUser } from '../backend/mock_api';
// import { getPost } from '../backend/mock_api';
// import { getUserID } from '../api/mock_api';
// const { setIntervalAsync } = require('set-interval-async');

function getFormattedDate(postdate) {
  const date = new Date(postdate);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${month}/${day}/${year}`;
}

const comparer = function sort(op1, op2) {
  if (op1.postDate >= op2.postDate) {
    return -1;
  }
  return 1;
};

function Activity() {
  const activity = useRef([]);
  const [numActivity, setNumActivity] = useState(0);

  const CurrentUserID = getUserID();
  console.log('CurrentID', CurrentUserID);
  const [inifIdx, setInfIdx] = useState(3);

  useEffect(() => {
    async function loadMoreData() {
      const userFollowing = await getFollowings(CurrentUserID);
      const postID = [];
      const hide = await getUser(CurrentUserID);
      // console.log('hide', hide);
      if (userFollowing.length !== 0) {
        const promise = [];
        for (let i = 0; i < userFollowing.length; i += 1) {
          promise.push(
            getUser(userFollowing[i]).then((response) => {
              postID.push(response.postlist.filter(
                // (x) => !response.hides.includes(x),
                (x) => !hide.hides.includes(x),
              ));
              // console.log(getUser(CurrentUserID));
            }),
          );
        }
        Promise.all(promise).then(() => {
          const actualPostID = postID.flat();
          const promisePost = [];
          const actualPost = [];
          for (let i = 0; i < actualPostID.length; i += 1) {
            promisePost.push(
              getPost(actualPostID[i]).then((response) => {
                actualPost.push(response);
              }),
            );
          }
          Promise.all(promisePost).then(() => {
            actualPost.sort(comparer);
            activity.current = actualPost;
            setNumActivity(actualPost.length);
          });
        });
        console.log('activity', activity.current);
        console.log('numActivity', numActivity);
      }
    }

    loadMoreData();
    setInterval(() => {
      loadMoreData();
      // setInfIdx(3);
    }, 5000);
  }, [numActivity]);
  console.log('numActivity', numActivity);

  window.onscroll = () => {
    const elementTopbar = document.querySelector('#root > nav');
    // console.log('elementTopbar', elementTopbar);
    const elementSuggest = document.querySelector('#suggestlist');
    // const elementActivity = document.querySelector('#root > section > div:nth-child(2)');
    const elementActivityHeader = document.querySelector('#root > section > div:nth-child(2) > h1');
    const elementActivity = document.querySelector('#root > section > div:nth-child(2) > section > div > ul');
    // #root > section > div:nth-child(2) > h1
    if (elementTopbar && elementSuggest && elementActivity && elementActivityHeader) {
      const cur = elementTopbar.offsetHeight
      + elementSuggest.offsetHeight
      + elementActivity.offsetHeight
      + elementActivityHeader.offsetHeight + 48;
      // console.log('cur', cur);
      // console.log('height', window.scrollY);
      if ((window.innerHeight + window.scrollY) >= cur) {
        setInfIdx(inifIdx + 2);
      }
    }
  };

  return (
    <>
      <TopBar id="topbar" />
      <section className="p-5 bg-dark">
        <div className="container" id="suggestlist">
          <SuggestList uid={CurrentUserID} showfollower={false} />
        </div>

        <div className="container">
          <h1 className="display-6 text-light text-left mb-3">
            Activities
            {/* {!render ? 'See Activities' : 'Activities'} */}
          </h1>
          {activity.current.length !== 0 ? (
            <section className="p-0 ">
              <div className="activity-container">
                <ImageList gap={10} dataSource={activity.current}>
                  <ImageListItem key="Subheader" cols={3} />
                  {activity.current.slice(0, inifIdx).map((item) => (
                    <ImageListItem key={item._id}>
                      <a href={`http://localhost:3000/post/${item._id}`} data-testid="profile">
                        <img
                          src={`${item.imageUrl}?w=350&fit=crop&auto=format`}
                          alt="showcase"
                          style={{
                            width: '26rem', height: '26rem', objectFit: 'cover',
                          }}
                          loading="lazy"
                        />
                      </a>

                      <ImageListItemBar
                        // title={`${item.postText}, ${item.postDate}`}
                        title={`${item.postText}, ${getFormattedDate(item.postDate)}`}
                        position="top"
                        actionIcon={
                            (CurrentUserID !== null)
                              ? (
                                <div>
                                  <Likebtn myid={CurrentUserID} postid={item._id} />
                                </div>
                              )
                              : <div />
                          }
                        actionPosition="left"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>
            </section>
          ) : <div />}
        </div>
        {/* <button onClick={handleLoadMore}>
          Load More
        </button> */}
      </section>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossOrigin="anonymous"
      />
    </>
  );
}

export default Activity;
