import React from 'react';
// import React, { useState } from 'react';
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import TopBar from '../component/TopBar';
// import { createUserPost, updateUserPost } from '../backend/mock_api';
import { createUserPost } from '../backend/mock_api';
import { getUserID, postadd2user } from '../api/mock_api';

function CreatePost() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    let imageUrl = '';
    let postText = '';
    event.preventDefault();
    const imageFile = event.target.imageFile?.files[0];
    postText = event.target[1]?.value;
    const postDate = new Date();

    // constant for now and need to be fixed
    const userId = getUserID();

    // validate
    if ((imageFile === null || imageFile === undefined) && (postText === '' || postText === undefined || postText === null)) {
      return;
    }

    if (imageFile !== undefined) {
      // upload file to cloudinary
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'darwin');

      const imageResult = await fetch('https://api.cloudinary.com/v1_1/dldiferrn/image/upload', {
        method: 'POST',
        body: data,
      });

      const image = await imageResult.json();
      imageUrl = image.secure_url;
    }

    const dbData = {
      imageUrl,
      postText,
      userId,
      postDate,
    };

    // updateUserPost(dbData);
    // store to db
    // updated id below - would also need to check
    createUserPost(dbData).then((response) => {
      // eslint-disable-next-line no-underscore-dangle
      console.log('response is', response.data.data._id);
      // eslint-disable-next-line no-underscore-dangle
      postadd2user(response.data.data._id, userId);
      // eslint-disable-next-line no-underscore-dangle
      console.log(response.data.data._id);
      // eslint-disable-next-line no-underscore-dangle
      navigate(`/post/${response.data.data._id}`);
    });
  }

  return (
    <>
      <TopBar />
      <section className="p-5">
        <div className="container">
          <div className="row">

            <div className="col">
              <div className="row">
                <div className="col-sm-3 p-2">
                  <p className="text-center fw-bold">UserID</p>
                  {' '}
                </div>
                <div className="col-sm-6 p-2">
                  {getUserID()}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2>Create new post</h2>
            <form onSubmit={handleSubmit}>
              <div>Select Image</div>
              <input data-testid="confirmPostImage" type="file" name="imageFile" placeholder="Please upload an image" />

              <input data-testid="confirmPostText" type="text" name="postText" placeholder="Put what you wanna say here..." rows="10" className="form-control" aria-label="With textarea" />

              <input data-testid="submitPost" type="submit" value="Submit Post" />
            </form>
          </div>
        </div>

      </section>
    </>
  );
}

export default CreatePost;
