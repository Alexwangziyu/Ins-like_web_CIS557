/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import TopBar from '../component/TopBar';
import {
  followchange, getUser, followadd, followdel, havefollowed,
  getUserID,
} from '../api/mock_api';
import { getPost } from '../backend/mock_api';
import Likebtn from '../component/Likebtn';
import Hidebtn from '../component/Hidebtn';
import hideimg from './P.png';
import SuggestList from '../component/SuggestList';

function Profile() {
  const [hasfollow, sethasfollow] = useState(false);
  const [udata, setUdata] = useState([]);
  const [posts, setPosts] = useState([]);
  const [hideset, sethideset] = useState(new Set());
  const [follownumber, setFollownumber] = useState(0);
  const params = useParams();
  const CurrentUserID = getUserID();

  useEffect(() => {
    getUser(params.userId).then((res) => setUdata(res));
    getUser(params.userId).then((res) => setFollownumber(res.follownum));
    havefollowed(params.userId, CurrentUserID).then((res) => sethasfollow(res));
  }, [params.userId]);

  useEffect(() => {
    console.log('udata', udata);
    // sethideset(new Set(udata.hides));
    getUser(getUserID()).then((res) => sethideset(new Set(res.hides)));
    const getPosts = async () => {
      if (udata.length !== 0) {
        const tasks = udata.postlist.map(async (item) => {
          const res = await getPost(item);
          return res;
        });
        const results = await Promise.all(tasks);
        setPosts(results);
      }
    };
    getPosts();
  }, [udata]);

  // useEffect(() => {
  //   sethideset(new Set(udata.hides));
  // }, []);

  return (
    <>
      <TopBar />
      <section className="p-5 bg-dark text-light">
        <div className="container">
          <div className="d-flex">

            <img
              src={udata.length !== 0 ? udata.uavatar : ''}
              alt="showcase"
              style={{
                width: '16rem', height: '16rem', objectFit: 'cover', borderRadius: '50%',
              }}
              loading="lazy"
            />
            <div className="mx-4">
              <h1><span className="text-warning">{udata.length !== 0 ? udata.name : ''}</span></h1>
              <div>
                <h4 className="text-warning">follower:</h4>
                <h4 className="text-warning">{follownumber }</h4>
              </div>
              {/* (CurrentUserID !== null) && (CurrentUserID!==udata.id) */}
              { (CurrentUserID !== udata._id)
                ? (!hasfollow)
                  ? (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm active followbtn"
                      onClick={() => {
                        sethasfollow(!hasfollow);
                        if (CurrentUserID !== null) {
                          followadd(CurrentUserID, udata._id);
                          setFollownumber(parseInt(follownumber, 10) + 1);
                          followchange(udata._id, parseInt(follownumber, 10) + 1);
                        }
                      }}
                      id="followbtn"
                      data-bs-toggle="button"
                      autoComplete="off"
                      aria-pressed="true"
                    >
                      FOLLOW!
                    </button>
                  )
                  : (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm active unfollowbtn"
                      onClick={() => {
                        sethasfollow(!hasfollow);
                        if (CurrentUserID !== null) {
                          followdel(CurrentUserID, udata._id);
                          setFollownumber(parseInt(follownumber, 10) - 1);
                          followchange(udata._id, parseInt(follownumber, 10) - 1);
                        }
                      }}
                      id="unfollowbtn"
                      data-bs-toggle="button"
                      autoComplete="off"
                      aria-pressed="true"
                    >
                      UNFOLLOW!
                    </button>
                  )
                : <div />}
              <p className="my-4">{udata.length !== 0 ? udata.profiletext : ''}</p>
            </div>
          </div>
        </div>
        <div className="container bg-dark">
          {(CurrentUserID === udata._id)
            ? <SuggestList uid={CurrentUserID} showfollower />
            : <div /> }
        </div>
      </section>
      <div className="container">
        <h1 className="post1">Posts:</h1>
      </div>
      {posts.length !== 0 ? (
        <section className="p-0">
          <div className="container">

            <ImageList gap={10}>
              <ImageListItem key="Subheader" cols={3} />
              {posts.map((item) => (
                !hideset.has(item._id) ? (
                  <ImageListItem key={item._id}>
                    <a href={`http://localhost:3000/post/${item._id}`}>
                      <img
                        src={`${item.imageUrl}?w=350&fit=crop&auto=format`}
                      // {...srcset(item.imageUrl, 250, 200, 1, 1)}
                        alt="showcase"
                        style={{
                          width: '26rem', height: '26rem', objectFit: 'cover',
                        }}
                        loading="lazy"
                      />
                    </a>

                    <ImageListItemBar
                      sx={{
                        background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.65) 30%, '
                        + 'rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.5) 50%,rgba(0,0,0,0) 100%)',
                      }}
                      title={`\xa0\xa0\xa0${item.postText}`}
                      position="top"
                      actionIcon={
                      (CurrentUserID !== null)
                        ? (
                          <div>
                            <Hidebtn
                              myid={CurrentUserID}
                              postid={item._id}
                              setfunc={sethideset}
                              change={hideset}
                            />
                            <Likebtn myid={CurrentUserID} postid={item._id} />
                          </div>
                        )
                        : <div />
                    }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ) : (
                  <ImageListItem key={item._id}>
                    <img
                      src={hideimg}
                      // {...srcset(item.imageUrl, 250, 200, 1, 1)}
                      alt="showcase"
                      style={{
                        width: '26rem', height: '26rem', objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      sx={{
                        background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.65) 30%, '
                    + 'rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.5) 50%,rgba(0,0,0,0) 100%)',
                      }}
                      position="top"
                      actionIcon={
                      (CurrentUserID !== null)
                        ? (
                          <Hidebtn
                            myid={CurrentUserID}
                            postid={item._id}
                            setfunc={sethideset}
                            change={hideset}
                          />
                        )
                        : <div />
                }
                      actionPosition="left"
                    />
                  </ImageListItem>
                )
              ))}
            </ImageList>
          </div>
        </section>
      ) : (
        <div className="container">
          {' '}
          <h3> :( Dont have any posts !</h3>
        </div>
      )}
      <div className="container">
        {/* <SuggestList uid={CurrentUserID}/> */}
        <h1>——————————————————————————————</h1>
      </div>
    </>
  );
}

export default Profile;
