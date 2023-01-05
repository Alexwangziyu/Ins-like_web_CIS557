import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../backend/mock_api';

import {
  getUserID, postdel2user, getUsers, getUser,
} from '../api/mock_api';

import TopBar from '../component/TopBar';
import MentionUser from '../component/mention';

function PostDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [postText, setPostText] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [userId, setuserId] = useState();
  const [udata, setUdata] = useState([]);
  const [theudata, settheudata] = useState({});

  useEffect(() => {
    getUsers().then((res) => setUdata(res));
  }, []);

  const handleClick = (postID) => {
    navigate(`../EditPost/${postID}`);
  };

  const users = udata.map((user) => ({ display: user.name, id: user._id }));

  // setPostText(res.data?.postText);
  // setImageUrl(res.data?.imageUrl);
  // setuserId(res.data?.userId);
  // useEffect(() => {
  //   getPost(id).then((res) => {
  //     setPostText(res?.postText);
  //     setImageUrl(res?.imageUrl);
  //     setuserId(res?.userId);
  //   });
  // }, []);

  useEffect(() => {
    getPost(id).then((res) => {
      setPostText(res?.postText);
      setImageUrl(res?.imageUrl);
      setuserId(res?.userId);
      return res.userId;
    }).then((res) => getUser(res)).then((res) => {
      settheudata(res);
    });
  }, []);
  // useEffect(() => {
  //   getUser(userId).then((res) => {
  //     settheudata(res);
  //   });
  // }, []);
  const CurrentUserID = getUserID();
  return (
    <>
      <TopBar />
      <section className="p-5">
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={imageUrl || ''} className="img-fluid" alt="pic" />
              {CurrentUserID === userId
                ? <input data-testid="submitPost" type="submit" value="Edit Post" onClick={() => { handleClick(id); }} />
                : null}
              {CurrentUserID === userId
                ? (
                  <input
                    data-testid="deletePost"
                    type="submit"
                    value="Delete Post"
                    onClick={() => {
                      deletePost(id);
                      postdel2user(id, CurrentUserID);
                      navigate(`../user/${CurrentUserID}`);
                    }}
                  />
                )
                : null}
            </div>
            <div className="col">
              <div className="row">
                <div className="col-sm-3 p-2">
                  <a href={`http://localhost:3000/profile/${theudata._id}`}>
                    <img
                      src={theudata.length !== 0 ? theudata.uavatar : ''}
                      alt="showcase"
                      style={{
                        width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '50%',
                      }}
                      loading="lazy"
                    />
                  </a>
                  <p className="text-center">
                    Poster:
                    { theudata.name }
                  </p>
                  <h2 data-testid="detailPostText" className="text-center">
                    { theudata.name }
                    {': '}
                    {postText || ''}
                  </h2>
                </div>

                <MentionUser users={users || []} id={id || 0} />

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PostDetail;
