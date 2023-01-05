/* eslint-disable no-restricted-syntax */
import axios from 'axios';
// import axios from '../axios-base';
// mockAPI URL
// const rootURL = 'https://634a3d305df95285140ddc9e.mockapi.io/user';
// JSON-server URL
// const rootURL = 'http://localhost:5000/User';
const finalURL = 'http://localhost:8080';
const backendURL = 'http://localhost:8080/user';
// const rootURLComment = 'http://localhost:5000/Comment';
const backendComment = 'http://localhost:8080/comment';

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

// Takes the id of a student as input
// and sends a Get request to the /student:id endpoint
// returns the attributes of the student
export const getUser = async (userID) => {
  // console.log('here');
  // console.log(`/User/${studentID}`);
  try {
    // add the token to the header
    setHeaders();
    // const response = await axios.get(`/User/${studentID}`);
    const response = await axios.get(`${backendURL}/${userID}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// Sends a Get request to the /student endpoint
// returns all the students in the DB
export const getUsers = async () => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${backendURL}`);
    return response.data.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// Takes a student (without the id) as input
// and sends a POST request to the /student endpoint
// returns the attributes of the student with the id
export const createStudent = async (studentObject) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.post(
      `${backendURL}`,
      `email=${studentObject.email}&password=${studentObject.password}&name=${studentObject.name}&uavatar=${studentObject.uavatar}&follownum=${studentObject.follownum}&profiletext=${studentObject.profiletext}&postlist=${studentObject.postlist}&following=${studentObject.following}&likes=${studentObject.likes}&hides=${studentObject.hides}`,
    );
    // console.log(response.status);
    return response.status;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const followchange = async (studentID, numb) => {
  try {
    setHeaders();
    const response = await axios.put(`${backendURL}/follownum/${studentID}`, `follownum=${numb}`);
    return response.data;
  // return the data with the id of the student
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const followadd = async (targetid, addid) => {
  try {
    setHeaders();
    // console.log('targetid', targetid);
    // console.log('addid', addid);
    const response = await axios.put(`${backendURL}/followadd/${targetid}`, `following=${addid}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const followdel = async (targetid, delid) => {
  try {
    setHeaders();
    // console.log(targetid);
    const response = await axios.put(`${backendURL}/followdel/${targetid}`, `following=${delid}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const havefollowed = async (other, me) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/havefollowed/${me}?checkid=${other}`);
    console.log('havefollow', response);
    return response.data.message;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const addhide = async (postid, me) => {
  try {
    setHeaders();
    console.log('hide', postid, me);
    const response = await axios.put(`${backendURL}/hideadd/${me}`, `postid=${postid}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const delhide = async (postid, me) => {
  try {
    setHeaders();
    const response = await axios.put(`${backendURL}/hidedel/${me}`, `postid=${postid}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const havehide = async (postid, me) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/havehide/${me}?postid=${postid}`);
    console.log('havehide', response);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const addlike = async (postid, me) => {
  try {
    setHeaders();
    console.log('getaddlike', postid, me);
    const response = await axios.put(`${backendURL}/likeadd/${me}`, `postid=${postid}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const dellike = async (postid, me) => {
  try {
    setHeaders();
    const response = await axios.put(`${backendURL}/likedel/${me}`, `postid=${postid}`);
    // console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const haveliked = async (postid, me) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/haveliked/${me}?postid=${postid}`);
    // console.log('haveliked1', response);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const createComment = async (newComment) => {
  try {
    const response = await axios.post(
      `${backendComment}`,
      `body=${newComment.body}&pid=${newComment.postid}&uid=${newComment.userid}`,
    );
    return response.status;
  // return the data with the id of the student
  } catch (err) {
    return err;
  }
};

export const getComments = async () => {
  try {
    const response = await axios.get(`${backendComment}`);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const getFollowings = async (userid) => {
  try {
    setHeaders();
    const response = await axios.get(`${backendURL}/followlist/${userid}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

export const deleteComment = async (commentid) => {
  try {
    await axios.delete(`${backendComment}/${commentid}`);
    return true;
  } catch (err) {
    return err;
  }
};

export const editComment = async (commentid, newComment, oldinfo) => {
  try {
    const response = await axios.put(
      `${backendComment}/${commentid}`,
      `body=${newComment}&pid=${oldinfo.pid}&uid=${oldinfo.uid}`,
    );
    console.log('new', newComment);
    return response.status;
  } catch (err) {
    return err;
  }
};

// export const getfollowsuggest = async (userid) => {
//   try {
//     setHeaders();
//     const response = await axios.get(`${rootURL}/${userid}`);
//     const flist = response.data.following;
//     // 我想把user1关注的人关注的人推荐给user1，然后还要去掉user1已经关注的人 所以用fset来帮助去重
//     const fset = new Set(flist);
//     // suggestset用来存user1关注的人关注的人 也就是输出结果 之所以用set是为了去重 最后把set转成array
//     const suggestset = new Set();
//     // eslint-disable-next-line no-array-constructor
//     await Promise.all(
//       flist.map(async (item) => {
//         const followt1 = await getUser(item);
//         await Promise.all(followt1.following.map(async (f2) => {
//           if (!fset.has(f2) && f2 !== userid) {
//             const followt2 = await getUser(f2);
//             suggestset.add({ userid: f2, ava: followt2.uavatar, nm: followt2.name });
//           }
//         }));
//       }),
//     );
//     if (suggestset.size === 0) {
//       const response2 = await getUsers();
//       for (const item of response2) {
//         if (!fset.has(item.id) && userid !== item.id) {
//           suggestset.add({ userid: item.id, ava: item.uavatar, nm: item.name });
//         }
//         if (suggestset.size >= 5) {
//           break;
//         }
//       }
//     }
//     return Array.from(suggestset);
//   } catch (err) {
//     // reAuthenticate(401);
//     return new Error('WRONG');
//   }
// };
export const getfollowsuggest = async (userid) => {
  try {
    console.log('getfollowsuggest', userid);
    const response = await axios.get(`${backendURL}/suggest/${userid}`);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export const processsuggest = async (userid, suggestarray) => {
  try {
    const suggest = [];
    const udata1 = await getUser(userid);
    const fset = new Set(udata1.following);
    await Promise.all(
      suggestarray.map(async (item) => {
        if (item !== userid && !fset.has(item)) {
          const udata = await getUser(item);
          suggest.push(udata);
        }
      }),
    );
    return suggest;
  } catch (err) {
    return err;
  }
};

export const processfollow = async (userid, suggestarray) => {
  try {
    const suggest = [];
    await Promise.all(
      suggestarray.map(async (item) => {
        if (item !== userid) {
          const udata = await getUser(item);
          suggest.push(udata);
        }
      }),
    );
    return suggest;
  } catch (err) {
    return err;
  }
};

export const getComment = async (commentid) => {
  try {
    const response = await axios.get(`${backendComment}/${commentid}`);
    return response.data.data;
  } catch (err) {
    return err;
  }
};

export default createStudent;

export const currentUser = () => {
  // e.g.  {"id": "fdahjk"}
  const thisUser = localStorage.getItem('currentUser');
  if (thisUser === undefined || thisUser === null || thisUser === '') {
    return JSON.parse(thisUser);
  }
  return undefined;
};

export const getUserID = () => {
  // // get current user's id
  // const localStorageResult = localStorage.getItem('currentUser');
  // const userID = JSON.parse(localStorageResult);
  // return userID;
  // get current user's id
  const sessionStorageResult = sessionStorage.getItem('id');
  try {
    const userID = JSON.parse(sessionStorageResult);
    return userID;
  } catch (err) {
    return '';
  }
  // return userID;
};

// export const getUserID = () => {
//   // // get current user's id
//   // const localStorageResult = localStorage.getItem('currentUser');
//   // const userID = JSON.parse(localStorageResult);
//   // return userID;
//   // get current user's id
//   const localStorageResult = localStorage.getItem('currentUser');
//   try {
//     const userID = JSON.parse(localStorageResult);
//     return userID;
//   } catch (err) {
//     return '';
//   }
//   // return userID;
// };

// updated but need to check
export const postadd2user = async (postid, userid) => {
  try {
    setHeaders();
    const response = await axios.put(`${backendURL}/postadd/${userid}`, `postlist=${postid}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// updated but need to check
export const postdel2user = async (postid, userid) => {
  try {
    setHeaders();
    const response = await axios.put(`${backendURL}/postdelete/${userid}`, `postlist=${postid}`);
    return response.data.data;
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// send a login request to backend
export const login = async (email) => {
  try {
    const response = await axios.post(
      `${finalURL}/login`,
      `email=${email}`,
    );
    sessionStorage.setItem('app-token', response.data.token);
    return response.data.token;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const loginHistory = 'http://localhost:8080/LoginHistory';

export const postLogHistory = async (user) => {
  try {
    const response = await axios.post(`${loginHistory}`, `loginId=${user.loginId}&loginTime=${user.loginTime}`);
    // console.log(response.status);
    return response.status;
  } catch (err) {
    return err;
  }
};

export const getLogHistory = async () => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${loginHistory}`);
    return response.data.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    // reAuthenticate(401);
    return err;
  }
};

// Zhen Zhang old post adduser
// export const postadd2user = async (postid, userid) => {
//   try {
//     const response = await axios.get(`${rootURL}/${userid}`);
//     const flist = response.data.postlist;
//     const fset = new Set(flist);
//     if ((fset.has(postid))) {
//       return true;
//     }
//     fset.add(postid);
//     const fflist = Array.from(fset);
//     await axios.patch(`${rootURL}/${userid}`, { postlist: fflist });
//     return true;
//   } catch (err) {
//     return err;
//   }
// };

// Zhen Zhang old post del user
// export const postdel2user = async (postid, userid) => {
//   try {
//     const response = await axios.get(`${rootURL}/${userid}`);
//     const flist = response.data.postlist;
//     const fset = new Set(flist);
//     fset.delete(parseInt(postid, 10));
//     const fflist = Array.from(fset);
//     await axios.patch(`${rootURL}/${userid}`, { postlist: fflist });
//     return true;
//   } catch (err) {
//     return err;
//   }
// };

// export const getactivity = async (userid) => {
//   try {
//     const response = await axios.get(`${rootURL}/${userid}`);
//     const flist = response.data.following;
//     // 读取关注列表
//     const activitylist = [];
//     // eslint-disable-next-line no-array-constructor
//     await Promise.all(
//       flist.map(async (item) => {
//         const followt1 = await getUser(item);
//         await Promise.all(followt1.postlist.map(async (postid) => {
//           const postobject = await getPost(postid);
//           activitylist.push(postobject.data);
//         }));
//       }),
//     );
//     const comparer = function (op1, op2) {
//       if (op1.postDate >= op2.postDate) {
//         return -1;
//       }
//       return 1;
//     };
//     activitylist.sort(comparer);
//     console.log(activitylist);
//     return activitylist;
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.error(err);
//     return err;
//   }
// };
