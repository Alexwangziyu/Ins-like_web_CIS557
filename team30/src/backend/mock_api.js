import axios from 'axios';

// const backendUrl = 'http://localhost:5000/Post';

const backendUrl = 'http://localhost:8080/Post';

// Add token to all HTTP request
const setHeaders = () => {
  axios.defaults.headers.common.Authorization = (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null;
};

/**
 *
 * deletes any (expired) token and relaunch the app
 */
// const reAuthenticate = (status) => {
//   if (status === 401) {
//     // delete the token
//     sessionStorage.removeItem('app-token');
//     // reload the app
//     window.location.reload(true);
//   }
// };

// `body=${newComment.body}&pid=${newComment.postid}&uid=${newComment.userid}`
export const createUserPost = async (request) => {
  // console.log(request);
  try {
    setHeaders();
    const response = await axios.post(
      backendUrl,
      `imageUrl=${request.imageUrl}&postText=${request.postText}&userId=${request.userId}`,
    );
    return response;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const getPost = async (id) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendUrl}/${id}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const getPostsbyUser = async (userid) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendUrl}/user/${userid}`);
    console.log('getPostbyUser in api', response);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export default 'createUserPost';

// check should the id be _id?
export const updatePost = async (request) => {
  // console.log('request is', request);
  // eslint-disable-next-line no-underscore-dangle
  // console.log('request is', request.id);
  try {
    setHeaders();
    // eslint-disable-next-line no-underscore-dangle
    const response = axios.put(
      `${backendUrl}/${request.id}`,
      `imageUrl=${request.imageUrl}&postText=${request.postText}&userId=${request.userId}`,
    );

    return response;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const deletePost = async (id) => {
  try {
    setHeaders();
    const response = axios.delete(`${backendUrl}/${id}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// export const createUserPost = async (request) => {
//   console.log(request);
//   try {
//     const response = await axios.post(backendUrl, {
//       id: request.id,
//       imageUrl: request.imageUrl,
//       postText: request.postText,
//       userId: request.userId,
//       postDate: request.postDate,
//     });
//     return response.status;
//   } catch (err) {
//     return err;
//   }
// };

// export const getPost = async (id) => {
//   try {
//     const response = await axios.get(`${backendUrl}/${id}`);
//     return response.data.data;
//   } catch (err) {
//     return err;
//   }
// };

// export default 'createUserPost';

// export const updatePost = async (request) => {
//   try {
//     const response = axios.put(`${backendUrl}/${request.id}`, {
//       id: request.id,
//       imageUrl: request.imageUrl,
//       postText: request.postText,
//       userId: request.userId,
//       postDate: request.postDate,
//     });
//     return response;
//   } catch (err) {
//     return err;
//   }
// };

// export const deletePost = async (id) => {
//   try {
//     const response = axios.delete(`${backendUrl}/${id}`);
//     return response.data.data;
//   } catch (err) {
//     return err;
//   }
// };
