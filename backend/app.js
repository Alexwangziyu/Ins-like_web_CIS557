const express = require('express');
const cors = require('cors');
// import JWT
const jwt = require('jsonwebtoken');

// best key ever in the world
const secretKey = '12345678';

// Import authentication operations
const auth = require('./auth');

const webapp = express();
webapp.use(cors());
webapp.use(express.urlencoded({ extended: true }));

// const commentRoute = require('./routes/commentRoute');

// webapp.use('/comment', commentRoute);

// (7) import the db interactions module
const dbLib = require('./mongodb');

// root endpoint / route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'welcome to our backend!!!' });
});

// implement the POST /comment/ endpoint
webapp.post('/comment', async (req, res) => {
  console.log('CREATE a comment');
  // parse the body of the request
  if (!req.body.body || !req.body.pid || !req.body.uid) {
    res.status(404).json({ message: 'missing text, postID, or userID' });
    return;
  }
  try {
    // create the new student
    const newComment = {
      body: req.body.body,
      pid: req.body.pid,
      uid: req.body.uid,
    };
    const result = await dbLib.createComment(newComment);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newComment } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// implement the GET /comments endpoint
webapp.get('/comment', async (req, res) => {
  console.log('READ all comments');
  try {
    // get the data from the db
    const results = await dbLib.getComments();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the GET /comment/:id endpoint
webapp.get('/comment/:id', async (req, res) => {
  console.log('READ a comment');
  try {
    // get the data from the db
    const results = await dbLib.getComment(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown comment' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the DELETE /comment/id endpoint
webapp.delete('/comment/:id', async (req, res) => {
  console.log('DELETE a comment');
  try {
    const result = await dbLib.deleteComment(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'student not in the system' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the PUT /comment/id endpoint
webapp.put('/comment/:id', async (req, res) => {
  console.log('UPDATE a comment');
  console.log('req', req.body);
  // parse the body of the request
  if (!req.body.body || !req.body.pid || !req.body.uid) {
    res.status(404).json({ message: 'missing text, postID, or userID' });
    return;
  }
  try {
    const oldinfo = { pid: req.body.pid, uid: req.body.uid };
    const result = await dbLib.editComment(req.params.id, req.body.body, oldinfo);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the GET /users endpoint
webapp.get('/user', async (req, res) => {
  console.log('READ all users');
  try {
    // get the data from the db
    const results = await dbLib.getUsers();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the GET /user/:id endpoint
webapp.get('/user/:id', async (req, res) => {
  console.log('READ a user');
  try {
    // get the data from the db
    const results = await dbLib.getUser(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the POST /user/ endpoint
webapp.post('/user', async (req, res) => {
  console.log('CREATE a user');
  // parse the body of the request
  if (!req.body.email || !req.body.password || !req.body.name) {
    res.status(404).json({ message: 'missing email, password, or name' });
    return;
  }
  try {
    // create the new student
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      uavatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/612.jpg',
      follownum: 0,
      profiletext: '',
      postlist: [],
      following: [],
      likes: [],
      hides: [],
    };
    const result = await dbLib.createStudent(newUser);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newUser } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

//------------------
// WZY
webapp.put('/user/follownum/:id', async (req, res) => {
  console.log('UPDATE a student');
  console.log(`ID ${req.params.id}`);
  console.log(`NUM ${req.body.follownum}`);
  // parse the body of the request
  if (!req.body.follownum) {
    res.status(404).json({ message: 'missing follownum' });
    return;
  }
  try {
    const result = await dbLib.followchange(req.params.id, req.body.follownum);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/followadd/:id', async (req, res) => {
  console.log('add a following');
  // parse the body of the request
  if (!req.body.following) {
    res.status(404).json({ message: 'missing followlist' });
    return;
  }
  try {
    const result = await dbLib.followadd(req.params.id, req.body.following);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/followdel/:id', async (req, res) => {
  console.log('del a following');
  // parse the body of the request
  if (!req.body.following) {
    res.status(404).json({ message: 'missing followlist' });
    return;
  }
  try {
    const result = await dbLib.followdel(req.params.id, req.body.following);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/user/havefollowed/:id', async (req, res) => {
  console.log('have followed?');
  // parse the body of the request
  // console.log(req);
  if (!req.params.id || !req.query.checkid) {
    res.status(404).json({ message: 'missing id' });
    return;
  }
  try {
    const result = await dbLib.havefollowed(req.params.id, req.query.checkid);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/user/followlist/:id', async (req, res) => {
  console.log('show followlist');
  // parse the body of the request
  // console.log(req);
  if (!req.params.id) {
    res.status(404).json({ message: 'missing id' });
    return;
  }
  try {
    const result = await dbLib.getFollowings(req.params.id);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/hideadd/:id', async (req, res) => {
  console.log('hide a post');
  // parse the body of the request
  if (!req.body.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.addhide(req.params.id, req.body.postid);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/hidedel/:id', async (req, res) => {
  console.log('unhide a post');
  // parse the body of the request
  if (!req.body.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.delhide(req.params.id, req.body.postid);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/user/havehide/:id', async (req, res) => {
  // console.log('have liked?');
  // parse the body of the request
  // console.log(req);
  if (!req.params.id || !req.query.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.havehide(req.params.id, req.query.postid);
    // send the response with the appropriate status code
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/likeadd/:id', async (req, res) => {
  console.log('like a post');
  // parse the body of the request
  if (!req.body.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.addlike(req.params.id, req.body.postid);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/likedel/:id', async (req, res) => {
  console.log('unlike a post');
  // parse the body of the request
  if (!req.body.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.dellike(req.params.id, req.body.postid);
    console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/user/haveliked/:id', async (req, res) => {
  // console.log('have liked?');
  // parse the body of the request
  // console.log(req);
  if (!req.params.id || !req.query.postid) {
    res.status(404).json({ message: 'missing postid' });
    return;
  }
  try {
    const result = await dbLib.haveliked(req.params.id, req.query.postid);
    // send the response with the appropriate status code
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/user/suggest/:id', async (req, res) => {
  console.log('suggest following');
  // parse the body of the request
  // console.log(req);
  if (!req.params.id) {
    res.status(404).json({ message: 'missing userid' });
    return;
  }
  try {
    const users = await dbLib.getUsers();
    const theuser = await dbLib.getUser(req.params.id);
    const suggest = [];
    const follow1 = new Set(theuser.following);
    users.map(async (item) => {
      if (!follow1.has(item._id) && item._id !== req.params.id) {
        const follow2 = new Set(item.following);
        const intersect = new Set([...follow1].filter((x) => follow2.has(x)));
        if (intersect.size >= 3) {
          suggest.push(item._id);
        }
      }
    });
    // send the response with the appropriate status code
    res.status(200).json({ data: suggest });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

//------------------
// Zhangzhen
webapp.post('/post', async (req, res) => {
  console.log('CREATE a post');
  // parse the body of the request
  if (!req.body.imageUrl || !req.body.postText || !req.body.userId) {
    res.status(404).json({ message: 'missing image URL, post text, userID, or date' });
    return;
  }
  try {
    // create the new student
    const newPost = {
      imageUrl: req.body.imageUrl,
      postText: req.body.postText,
      userId: req.body.userId,
      postDate: new Date(),
    };
    const result = await dbLib.createUserPost(newPost);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newPost } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

webapp.get('/post', async (req, res) => {
  console.log('READ all posts');
  try {
    // get the data from the db
    const results = await dbLib.getPosts();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/post/:id', async (req, res) => {
  console.log('READ a post');
  try {
    // get the data from the db
    const results = await dbLib.getPost(req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/post/user/:id', async (req, res) => {
  console.log('READ a post by userId');
  try {
    // get the data from the db
    const results = await dbLib.getPostsbyUser(req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/post/:id', async (req, res) => {
  console.log('UPDATE a post');
  // parse the body of the request
  if (!req) {
    res.status(404).json({ message: 'missing something!' });
    return;
  }
  try {
    const result = await dbLib.updatePost(
      req,
    );
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.delete('/post/:id', async (req, res) => {
  console.log('DELETE a post');
  try {
    const result = await dbLib.deletePost(req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/postadd/:id', async (req, res) => {
  console.log('add a post to user');
  if (!req.body.postlist) {
    res.status(404).json({ message: 'missing post' });
    return;
  }
  try {
    const result = await dbLib.postadd2user(req.body.postlist, req.params.id);
    // console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/postdelete/:id', async (req, res) => {
  console.log('del a post from user');
  if (!req.body.postlist) {
    res.status(404).json({ message: 'missing post' });
    return;
  }
  try {
    const result = await dbLib.postdel2user(req.body.postlist, req.params.id);
    // console.log(result);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// login endpoint

webapp.post('/login', (req, res) => {
  console.log('create a new session');
  // check the user name and also the password
  if (!req.body.email) {
    res.status(401).json({ error: 'Missing login email address' });
    res.end();
  }
  // if (!req.body.password) {
  //   res.status(401).json({ error: 'Missing login password' });
  //   res.end();
  // }
  // sign the token and send to the frontend
  try {
    const jwtoken = jwt.sign({ _id: req.body._id }, secretKey, { expiresIn: '120h' });
    res.status(201).json({ token: jwtoken, id: req.body._id });
  } catch (err) {
    res.status(401).json({ error: 'There was an error' });
  }
});

webapp.post('/LoginHistory', async (req, res) => {
  console.log('CREATE a login history');
  // parse the body of the request
  if (!req.body.loginId) {
    res.status(404).json({ message: 'missing loginid' });
    return;
  }
  try {
    // create the new student
    const newLoginHistory = {
      loginId: req.body.loginId,
      loginTime: req.body.loginTime,
    };
    const result = await dbLib.createLoginHistory(newLoginHistory);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newLoginHistory } });
    console.log('Successfully CREATE a login history');
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

webapp.get('/LoginHistory', async (req, res) => {
  console.log('Get all login history');
  try {
    // get the data from the db
    const results = await dbLib.getLoginHistory();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

module.exports = webapp;
