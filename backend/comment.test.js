const request = require('supertest');
// Import MongoDB module
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./mongodb');
const webapp = require('./app');

let mongo;

// TEST PUT ENDPOINT
describe('Delete a comment endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */
  let res;
  let db;
  let testcommentID;

  /**
     *  Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    res = await request(webapp).post('/comment/')
      .send('body=testingcomment&pid=123&uid=123');
    // eslint-disable-next-line no-underscore-dangle
    testcommentID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Comment').deleteOne({ body: 'testingcomment' });

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
    const resp = await request(webapp).delete(`/comment/${testcommentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // the user is not in the database
    const resp1 = await db.collection('students').findOne({ _id: ObjectId(testcommentID) });
    expect(resp1).toBeNull();
  });

  test('wrong comment id format/exception - response 404', async () => {
    const resp = await request(webapp).delete('/comment/1');
    expect(resp.status).toEqual(404);
  });

  test('comment id not in system (correct id format) - response 404', async () => {
    const resp = await request(webapp).delete('/comment/63738b602fe72e59d4a72abc');
    expect(resp.status).toEqual(404);
  });
});

describe('POST /comment enpoint tests', () => {
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
    response = await request(webapp).post('/comment/')
      .send('body=testingcomment&pid=123&uid=123');
  });
  /**
 * removes all testing data from the DB
 */
  const clearDatabase = async () => {
    try {
      const result = await db.collection('Comment').deleteOne({ name: 'testingcomment' });
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
  test('the new comment is returned', () => {
    const testComment = { body: 'testingcomment', pid: '123', uid: '123' };
    expect(JSON.parse(response.text).data).toMatchObject(testComment); // status code
  });

  test('The new comment is in the database', async () => {
    const insertedUser = await db.collection('Comment').findOne({ body: 'testingcomment' });
    expect(insertedUser.body).toEqual('testingcomment');
  });

  test('missing a field (uid) 404', async () => {
    const res = await request(webapp).post('/comment/')
      .send('body=testingcomment&pid=123');
    expect(res.status).toEqual(404);
  });
});

// TEST POST ENDPOINT
describe('GET comment(s) endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testcommentID;
  // test resource to create / expected response
  const testComment = { body: 'testingcomment', pid: '123', uid: '123' };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/comment/')
      .send('body=testingcomment&pid=123&uid=123');
    // eslint-disable-next-line no-underscore-dangle
    testcommentID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Comment').deleteOne({ name: 'testingcomment' });
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

  test('Get all comments endpoint status code and data', async () => {
    const resp = await request(webapp).get('/comment/');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toEqual(expect.arrayContaining([{ _id: testcommentID, ...testComment }]));
  });

  test('Get a student endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/comment/${testcommentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toMatchObject({ _id: testcommentID, ...testComment });
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).get('/comment/1');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});

// TEST PUT ENDPOINT
describe('Update a student endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */

  let res;
  let db;
  let testcommentID; // will store the id of the test student

  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    res = await request(webapp).post('/comment/')
      .send('body=testingcomment&pid=123&uid=123');
    // get the id of the test student
    // eslint-disable-next-line no-underscore-dangle
    testcommentID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      await db.collection('students').deleteOne({ name: 'testingcomment' });
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

  test('Endpoint status code and response async/await', async () => {
    res = await request(webapp).put(`/comment/${testcommentID}`)
      .send('body=testingEdit&pid=123&uid=123');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedUser = await db.collection('Comment').findOne({ _id: ObjectId(testcommentID) });
    expect(updatedUser.body).toEqual('testingEdit');
  });

  test('missing major 404', async () => {
    res = await request(webapp).put(`/comment/${testcommentID}`)
      .send('body=testingEdit');
    expect(res.status).toEqual(404);
  });
});
