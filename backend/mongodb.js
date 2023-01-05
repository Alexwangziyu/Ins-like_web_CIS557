/* eslint-disable consistent-return */
// import the mongodb driver
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const dbURL = 'mongodb+srv://JiayunHe:0601@cluster0.3ouyawn.mongodb.net/Team30?retryWrites=true&w=majority';

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    ));
    // check that we are connected to the db
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
    return err;
  }
};

/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

const getPostsbyUser = async (userid) => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').find({ userId: userid }).toArray();
    // print the result

    console.log(`Post: ${result}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const createComment = async (newComment) => {
  const db = await getDB();
  // callback version
  db.collection('Comment').insertOne(
    newComment,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
        return;
      }
      // print the id of the student
      console.log(`New comment created with id: ${result.insertedId}`);
    },
  );
};

// READ a comment given their ID
const getComment = async (commentid) => {
  try {
    const db = await getDB();
    const result = await db.collection('Comment').findOne({ _id: ObjectId(commentid) });
    // print the result
    // console.log(`Comment: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ all comments
// await/async syntax
const getComments = async () => {
  try {
    const db = await getDB();
    const result = await db.collection('Comment').find({}).toArray();
    // print the results
    // console.log(`Comments: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// DELETE a comment given their ID
const deleteComment = async (commentid) => {
  try {
    const db = await getDB();
    const result = await db.collection('Comment').deleteOne(
      { _id: ObjectId(commentid) },
    );
    // print the result
    // console.log(`Comment: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a comment given their ID
const editComment = async (commentid, newComment, oldinfo) => {
  try {
    const db = await getDB();
    const result = await db.collection('Comment').updateOne(
      { _id: ObjectId(commentid) },
      {
        $set: {
          body: newComment,
          pid: oldinfo.pid,
          uid: oldinfo.uid,
        },
      },
    );
      // print the result
    // console.log(`Comment: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ a user given their ID
const getUser = async (userID) => {
  try {
    const db = await getDB();
    const result = await db.collection('User').findOne({ _id: ObjectId(userID) });
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ all users
// await/async syntax
const getUsers = async () => {
  try {
    const db = await getDB();
    const result = await db.collection('User').find({}).toArray();
    // print the results
    // console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const createStudent = async (studentObject) => {
  // callback version
  const db = await getDB();
  db.collection('User').insertOne(
    studentObject,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
        return;
      }
      // print the id of the student
      console.log(`New User created with id: ${result.insertedId}`);
    },
  );
};

// wzy following：
const followchange = async (studentID, numb) => {
  try {
    const db = await getDB();
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(studentID.toString()) },
      {
        $set: {
          follownum: numb,
        },
      },
    );
    // print the result
    // console.log(`followchanged: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const followadd = async (studentID, beaddID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    const oldinfo = oldres.following;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(beaddID)) {
      return 'has followed';
    }
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(studentID) },
      {
        $set: {
          following: [beaddID, ...oldinfo],
        },
      },
    );
    // print the result
    // console.log(`followadded: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const followdel = async (studentID, bedelID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    const oldinfo = oldres.following;
    const oldinfoset = new Set(oldinfo);
    if (!oldinfoset.has(bedelID)) {
      return 'not followed';
    }
    oldinfoset.delete(bedelID);
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(studentID) },
      {
        $set: {
          following: Array.from(oldinfoset),
        },
      },
    );
    // print the result
    // console.log(`followdeled: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const havefollowed = async (studentID, haveID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    const oldinfo = oldres.following;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(haveID)) {
      console.log('havefollowed: true');
      return true;
    }
    // console.log('havefollowed: false');
    return false;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getFollowings = async (studentID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    return oldres.following;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const addhide = async (userid, postID) => {
  try {
    const db = await getDB();
    console.log('get', userid, postID);
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.hides;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(postID)) {
      return 'has hided';
    }
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          hides: [postID, ...oldinfo],
        },
      },
    );
    // print the result
    // console.log(`followadded: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const delhide = async (userid, postID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.hides;
    const oldinfoset = new Set(oldinfo);
    if (!oldinfoset.has(postID)) {
      return 'have not liked';
    }
    oldinfoset.delete(postID);
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          hides: Array.from(oldinfoset),
        },
      },
    );
    // print the result
    // console.log(`followdeled: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const havehide = async (studentID, haveID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    const oldinfo = oldres.hides;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(haveID)) {
      console.log('havelikeed: true');
      return true;
    }
    // console.log('havefollowed: false');
    return false;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const addlike = async (userid, postID) => {
  try {
    const db = await getDB();
    console.log('get', userid, postID);
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.likes;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(postID)) {
      return 'has liked';
    }
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          likes: [postID, ...oldinfo],
        },
      },
    );
    // print the result
    // console.log(`followadded: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const dellike = async (userid, postID) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.likes;
    const oldinfoset = new Set(oldinfo);
    if (!oldinfoset.has(postID)) {
      return 'have not liked';
    }
    oldinfoset.delete(postID);
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          likes: Array.from(oldinfoset),
        },
      },
    );
    // print the result
    // console.log(`followdeled: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const haveliked = async (studentID, haveID) => {
  try {
    // console.log('11111111111111111');
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(studentID) });
    const oldinfo = oldres.likes;
    const oldinfoset = new Set(oldinfo);
    if (oldinfoset.has(haveID)) {
      console.log('havelikeed: true');
      return true;
    }
    // console.log('havefollowed: false');
    return false;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

//------------------
// Zhangzhen

const createUserPost = async (newPost) => {
  // callback version
  const db = await getDB();
  db.collection('Post').insertOne(
    newPost,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
        return;
      }
      // print the id of the student
      console.log(`New post created with id: ${result.insertedId}`);
    },
  );
};

const getPosts = async () => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').find({}).toArray();
    // print the results
    // console.log(`Posts: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getPost = async (postid) => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').findOne({ _id: ObjectId(postid) });
    // print the result
    // console.log(`Post: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const updatePost = async (request) => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').updateOne(
      { _id: ObjectId(request.params.id) },
      {
        $set: {
          imageUrl: request.body.imageUrl,
          postText: request.body.postText,
          userId: request.body.userId,
          postDate: new Date(),
        },
      },
    );
      // print the result
    // console.log(`Post: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const deletePost = async (postid) => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').deleteOne(
      { _id: ObjectId(postid) },
    );
    // print the result
    // console.log(`Post: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const postadd2user = async (postid, userid) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.postlist;
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          postlist: [postid, ...oldinfo],
        },
      },
    );
    // print the result
    // console.log(`Post list: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const postdel2user = async (postid, userid) => {
  try {
    const db = await getDB();
    const oldres = await db.collection('User').findOne({ _id: ObjectId(userid) });
    const oldinfo = oldres.postlist;
    const oldinfoset = new Set(oldinfo);
    oldinfoset.delete(postid);
    const result = await db.collection('User').updateOne(
      { _id: ObjectId(userid) },
      {
        $set: {
          postlist: Array.from(oldinfoset),
        },
      },
    );
      // print the result
    // console.log(`Post list: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const createLoginHistory = async (LoginObject) => {
  // callback version
  const db = await getDB();
  db.collection('LoginHistory').insertOne(
    LoginObject,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
        return;
      }
      // print the id of the student
      console.log(`Login log created: ${result}`);
    },
  );
};

const getLoginHistory = async () => {
  try {
    const db = await getDB();
    const result = await db.collection('LoginHistory').find({}).toArray();
    // print the results
    // console.log(`Posts: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// const {
//   createComment,
//   getComment,
//   getComments,
//   deleteComment,
//   editComment,
// } = require('./mongodb/comment');

// const {
//   createStudent,
//   getUser,
//   getUsers,
// } = require('./mongodb/user');

// const {
//   followchange,
//   followadd,
//   followdel,
//   havefollowed,
//   getFollowings,
// } = require('./mongodb/follow');

// const {
//   createUserPost,
//   getPost,
//   updatePost,
//   deletePost,
//   postadd2user,
//   postdel2user,
//   currentUser,
//   getUserID,
// } = require('./mongodb/post');

module.exports = {
  connect,
  createComment,
  getComment,
  getComments,
  deleteComment,
  editComment,
  createStudent,
  getUser,
  getUsers,
  closeMongoDBConnection,
  getDB,
  followchange,
  followadd,
  followdel,
  havefollowed,
  getFollowings,
  haveliked,
  addlike,
  dellike,
  addhide,
  delhide,
  havehide,
  createUserPost,
  getPost,
  updatePost,
  deletePost,
  postadd2user,
  postdel2user,
  getPosts,
  getPostsbyUser,
  createLoginHistory,
  getLoginHistory,
  // currentUser,
  // getUserID,
};
