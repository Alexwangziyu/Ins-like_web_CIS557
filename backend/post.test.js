const request = require('supertest');
// Import MongoDB module
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./mongodb');
const webapp = require('./app');

let mongo;

// delete a post
describe('Delete a post endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */
  let res;
  let db;
  let testpostID;

  /**
     *  Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    res = await request(webapp).post('/post/')
      .send('imageUrl=abc&postText=123&userId=123&postDate=11221998');
    // eslint-disable-next-line no-underscore-dangle
    testpostID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').deleteOne({ imageUrl: 'abc' });
      console.log('info', result);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client started when running express.
    } catch (err) {
      return err;
    }
  });

  test('Endpoint response: status code, type and content', async () => {
    // successful deletion returns 200 status code
    const resp = await request(webapp).delete(`/post/${testpostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // the user is not in the database
    const resp1 = await db.collection('post').findOne({ _id: ObjectId(testpostID) });
    expect(resp1).toBeNull();
  });

  test('wrong post id format/exception - response 404', async () => {
    const resp = await request(webapp).delete('/post/1ldjfaksl/jfidoas');
    expect(resp.status).toEqual(404);
  });
});

// test the getpost endpoint
// TEST POST ENDPOINT
describe('GET post(s) endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testpostID;
  // test resource to create / expected response
  const testPost = {
    imageUrl: 'test1', postText: 'test2', userId: 'test3',
  };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/post/')
      .send('imageUrl=test1&postText=test2&userId=test3');
    // eslint-disable-next-line no-underscore-dangle
    testpostID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').deleteOne({ imageUrl: 'test1' });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully deleted test comment');
      } else {
        console.log('warning', 'test comment was not deleted');
      }
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get all posts', async () => {
    const resp = await request(webapp).get('/post/');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    // expect(studArr).toEqual(expect.arrayContaining([{ _id: testpostID, ...testPost }]));
  });

  test('Get a post endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/post/${testpostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toMatchObject({ _id: testpostID, ...testPost });
  });

  // test('user not in db status code 404', async () => {
  //   const resp = await request(webapp).get('/comment/1');
  //   expect(resp.status).toEqual(404);
  //   expect(resp.type).toBe('application/json');
  // });
});

// test put post
describe('Put post', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */

  let res;
  let db;
  let testpostID; // will store the id of the test student

  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    res = await request(webapp).post('/post/')
      .send('imageUrl=test1&postText=test2&userId=test3');
    // get the id of the test student
    // eslint-disable-next-line no-underscore-dangle
    testpostID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      await db.collection('post').deleteOne({ imageUrl: 'test1' });
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Test put post', async () => {
    res = await request(webapp).put(`/post/${testpostID}`)
      .send('imageUrl=test1&postText=ahahahahaha&userId=test3');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedUser = await db.collection('Post').findOne({ _id: ObjectId(testpostID) });
    expect(updatedUser.postText).toEqual('ahahahahaha');
  });

  test('missing put data', async () => {
    res = await request(webapp).put(`/comment/${testpostID}`)
      .send('');
    expect(res.status).toEqual(404);
  });
});

// test post post
describe('POST /post enpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  /**
     * We need to make the request to the endpoint
     * before running any test.
     * We need to connecto the DB for all the DB checks
     * If beforeAll is undefined
     * inside .eslintrc.js, add 'jest' to the 'env' key
     */
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();
    // send the request to the API and collect the response
    response = await request(webapp).post('/post/')
      .send('imageUrl=test1&postText=ahahahahaha&userId=test3');
  });
  /**
 * removes all testing data from the DB
 */
  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').deleteOne({ imageUrl: 'test1' });
      console.log('result', result);
    } catch (err) {
      console.log('error', err.message);
    }
  };

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  /**
 * response body
 */
  // imageUrl=test1&postText=ahahahahaha&userId=test3
  test('the new post is returned', () => {
    const testPost = { imageUrl: 'test1', postText: 'ahahahahaha', userId: 'test3' };
    expect(JSON.parse(response.text).data).toMatchObject(testPost); // status code
  });

  test('The new post is in the database', async () => {
    const insertedUser = await db.collection('Post').findOne({ imageUrl: 'test1' });
    expect(insertedUser.imageUrl).toEqual('test1');
  });

  test('missing a field (uid) 404', async () => {
    const res = await request(webapp).post('/post/')
      .send('');
    expect(res.status).toEqual(404);
  });
});

// test post login history
describe('POST loginhistory', () => {
  let db; // the db
  let response; // the response from our express server
  /**
     * We need to make the request to the endpoint
     * before running any test.
     * We need to connecto the DB for all the DB checks
     * If beforeAll is undefined
     * inside .eslintrc.js, add 'jest' to the 'env' key
     */
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();
    // send the request to the API and collect the response
    response = await request(webapp).post('/LoginHistory/')
      .send('loginId=test1&loginTime=12/20/2022');
  });
  /**
 * removes all testing data from the DB
 */
  const clearDatabase = async () => {
    try {
      const result = await db.collection('LoginHistory').deleteOne({ loginId: 'test1' });
      console.log('result', result);
    } catch (err) {
      console.log('error', err.message);
    }
  };

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  test('the new post is returned', () => {
    const testPost = { loginId: 'test1', loginTime: '12/20/2022' };
    expect(JSON.parse(response.text).data).toMatchObject(testPost); // status code
  });

  test('The new post is in the database', async () => {
    const insertedUser = await db.collection('LoginHistory').findOne({ loginId: 'test1' });
    expect(insertedUser.loginId).toEqual('test1');
  });

  test('missing a field (uid) 404', async () => {
    const res = await request(webapp).post('/LoginHistory/')
      .send('');
    expect(res.status).toEqual(404);
  });
});

// TEST get loginhistory endpoint
describe('GET LoginHistory', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testpostID;
  // test resource to create / expected response
  const testPost = { loginId: 'test1', loginTime: '12/20/2022' };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/LoginHistory/')
      .send('loginId=test1&loginTime=12/20/2022');
    // eslint-disable-next-line no-underscore-dangle
    testpostID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('LoginHistory').deleteOne({ loginId: 'test1' });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully get login history');
      } else {
        console.log('warning', 'test login history was not deleted');
      }
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get all posts', async () => {
    const resp = await request(webapp).get('/LoginHistory/');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    // expect(studArr).toEqual(expect.arrayContaining([{ _id: testpostID, ...testPost }]));
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).put(`/user/postadd/${1}`).send(`postlist=${1}`);
    expect(resp.status).toEqual(200);
    const resp1 = await request(webapp).put(`/user/postadd/${2}`).send('');
    expect(resp1.status).toEqual(404);
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).put(`/user/postdelete/${1}`).send(`postlist=${1}`);
    expect(resp.status).toEqual(200);
    const resp1 = await request(webapp).put(`/user/postdelete/${2}`).send('');
    expect(resp1.status).toEqual(404);
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).post('/login').send(``);
    expect(resp.status).toEqual(401);
  });
});
