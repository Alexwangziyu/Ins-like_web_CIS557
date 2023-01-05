/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const request = require('supertest');
// Import MongoDB module
// const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./mongodb');
const webapp = require('./app');

let mongo;

// TEST POST ENDPOINT
// eslint-disable-next-line no-undef
describe('GET user(s) endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testuserID;
  // test resource to create / expected response
  const testUser = {
    email: '123',
    password: 'ABC123',
    name: 'testingUser',
    uavatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/612.jpg',
    follownum: 0,
    profiletext: '',
    postlist: [],
    following: [],
    likes: [],
    hides: [],
  };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/user/')
      .send(
        'email=123&password=ABC123&name=testingUser&uavatar=0&follownum=0&profiletext=abc&postlist=[]&following=[]&likes=[]&hides=[]',
      );
    // eslint-disable-next-line no-underscore-dangle
    testuserID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('User').deleteOne({ name: 'testingUser' });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully deleted test user');
      } else {
        console.log('warning', 'test user was not deleted');
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

  test('Get all users endpoint status code and data', async () => {
    const resp = await request(webapp).get('/user/');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toEqual(expect.arrayContaining([{ _id: testuserID, ...testUser }]));
  });

  test('Get a user endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/user/${testuserID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toMatchObject({ _id: testuserID, ...testUser });
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).get('/user/1');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).put(`/user/follownum/${testuserID}`).send(`follownum=${1}`);
    const resp3 = await request(webapp).put(`/user/followadd/${testuserID}`).send('following=testid2');
    const resp4 = await request(webapp).get(`/user/havefollowed/${testuserID}?checkid=testid2`);
    expect(resp.status).toEqual(200);
    expect(resp3.status).toEqual(200);
    const resp2 = await request(webapp).get(`/user/${testuserID}`);
    // console.log('xxxxx', JSON.parse(resp2.text).data.following);
    // const resp2 = await request(webapp).get(`/user/${testuserID}`);
    expect(parseInt(JSON.parse(resp2.text).data.follownum)).toBe(1);
    expect(JSON.parse(resp4.text).message).toBe(true);
    const resp6 = await request(webapp).put(`/user/followdel/${testuserID}`).send('following=testid2');
    expect(resp6.status).toEqual(200);
    const resp7 = await request(webapp).get(`/user/havefollowed/${testuserID}?checkid=testid2`);
    expect(JSON.parse(resp7.text).message).toBe(false);
    const resp8 = await request(webapp).get(`/user/havefollowed/${testuserID}?checkid=testid3`);
    expect(JSON.parse(resp8.text).message).toBe(false);
    const resp9 = await request(webapp).get(`/user/followlist/${testuserID}`);
    expect(resp9.status).toEqual(200);
  });
});
