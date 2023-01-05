import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { getPost, updatePost } from '../backend/mock_api';
import TopBar from '../component/TopBar';

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [oldPostText, setOldPostText] = useState();
  const [oldImageUrl, setOldImageUrl] = useState();
  const [userId, setuserId] = useState();

  // setOldPostText(res.data?.postText);
  // setOldImageUrl(res.data?.imageUrl);
  // setuserId(res.data?.userId);
  useEffect(() => {
    getPost(id).then((res) => {
      setOldPostText(res.postText);
      setOldImageUrl(res.imageUrl);
      setuserId(res.userId);
    });
  }, [id]);

  async function handleUpdate(event) {
    let imageUrl = '';
    let postText = '';
    event.preventDefault();
    const imageFile = event.target.imageFile?.files[0];
    postText = event.target[1]?.value;
    const postDate = new Date();

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
    if ((imageUrl === null || imageUrl === undefined || imageUrl === '')) {
      imageUrl = oldImageUrl;
    }

    if ((postText === '' || postText === undefined || postText === null)) {
      postText = oldPostText;
    }
    const dbData = {
      id,
      imageUrl,
      postText,
      userId,
      postDate,
    };

    // const updatePost = async () => axios.put(`http://localhost:5000/Post/${id}`, {
    //   id,
    //   imageUrl,
    //   postText,
    //   userId,
    //   likes,
    //   tags,
    //   comments,
    // });
    updatePost(dbData).then(navigate(`/post/${id}`));
  }

  return (
    <>
      <TopBar />
      <section className="p-5">
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={oldImageUrl || ''} className="img-fluid" alt="pic" />
              <p data-testid="detailPostText">
                Content:
                {oldPostText || ''}
              </p>
              <p>
                Post id is
                {' '}
                { id }
              </p>
            </div>

            <div className="col">
              <div className="row">
                <div className="col-sm-3 p-2">
                  <h className="text-center fw-bold">
                    User ID:
                    { userId }
                  </h>
                </div>
                <div className="col-sm-6 p-2">
                  <h data-testid="UserName" className="text-center fw-bold">Alex Wang</h>
                </div>
              </div>
              <div className="row">
                <div>
                  <h2>UpdatePost</h2>
                  <form onSubmit={handleUpdate}>
                    <div>Select Image</div>
                    <input data-testid="confirmPostImage" type="file" name="imageFile" placeholder="Please upload an image" />

                    <input data-testid="confirmPostText" type="text" name="postText" placeholder="Put what you wanna say here..." rows="10" className="form-control" aria-label="With textarea" />

                    <input data-testid="submitPost" type="submit" value="Submit Post" />
                  </form>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </>
  );
}

export default EditPost;
