import axios from 'axios';

export const user1 = {
  email: 'Hiiii',
  password: 'Abc123!!',
  id: 'HLH6Drg',
  name: 'username1',
  uavatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/971.jpg',
  follownum: 62,
  profiletext: 'Consequatur quo qui inventore. Nesciunt odio nisi nesciunt aperiam aut aut iusto deserunt voluptas. Occaecati voluptatibus saepedolores veritatis aut eum. Neque qui facilis earum eos velit numquam commodi sint ut.',
  postlist: [
    1,
    2,
    3,
    6,
  ],
  following: [
    '1l1nmDQ',
    'testid2',
    'testid3',
  ],
  likes: [
    2,
    1,
  ],
};
export const user2 = {
  email: 'qwert',
  password: 'Abc123!!',
  id: '1l1nmDQ',
  name: 'username2',
  uavatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/612.jpg',
  follownum: 97,
  profiletext: 'Fugiat accusantium suscipit sit eos. Nesciunt aliquid nostrum repellat est ut aut earum. Temporibus expedita aut animi quidem doloreearum odio ut. Sapiente consequatur iusto eum.',
  postlist: [
    4,
    5,
  ],
  following: [
    'HLH6Drg',
  ],
  likes: [
    1,
    2,
  ],
};

export const post1 = {
  id: 1,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1667858043/darwin/cy6mqfl2zw6tvghltnwb.png',
  postText: 'Should be a butter fly!',
  userId: 'HLH6Drg',
  postDate: '2021-11-11T16:39:30.842Z',
};

export const post2 = {
  id: 2,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1667951957/darwin/npkeplnzbl30me7eu80p.png',
  postText: 'ifdoaspfdsa',
  userId: 'HLH6Drg',
  postDate: '2022-10-11T13:39:30.842Z',
};

export const post3 = {
  id: 3,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1667881383/darwin/yuqitdi6btgswi5grkls.png',
  postText: '',
  userId: 'HLH6Drg',
  postDate: '2022-10-11T16:39:30.842Z',
};

export const post4 = {
  id: 4,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1667881609/darwin/peoumg8ofxvjepwh4mex.png',
  postText: 'tae',
  userId: '1l1nmDQ',
  postDate: '2021-11-01T16:39:30.842Z',
};

export const post5 = {
  id: 5,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1667881622/darwin/riwxssv0vl3ee2oyhvs6.jpg',
  postText: 'This is not my dog!',
  userId: '1l1nmDQ',
  postDate: '2022-11-05T16:39:30.842Z',
};

export const post6 = {
  id: 6,
  imageUrl: 'https://res.cloudinary.com/dldiferrn/image/upload/v1668184748/darwin/ldkbztnskp9kif6vcpyj.png',
  postText: 'fdafdsafewqreqwrewq',
  userId: 'HLH6Drg',
  postDate: '2022-11-11T16:39:30.842Z',
};

export const comment1 = {
  body: 'edit comment',
  pid: '1',
  uid: 'HLH6Drg',
  id: 1,
};

export const comment2 = {
  body: '@[username1]',
  pid: '2',
  id: 2,
  uid: 'testid3',
};

export default function mockBackendAxios() {
  // eslint-disable-next-line global-require
  const MockAdapter = require('axios-mock-adapter');
  // const lib = require('./Pages/Login');

  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

  mock.onGet('http://localhost:8080/user')
    .reply(200, { data: [user1, user2] });

  mock.onGet('http://localhost:8080/user/1').reply(200, {
    data: { id: 1, name: 'John Smith' },
  });

  mock.onGet('http://localhost:8080/user/HLH6Drg')
    .reply(200, { data: user1 });

  mock.onGet('http://localhost:8080/user/undefined')
    .reply(200, { data: user1 });

  // mock.onGet('http://localhost:5000/User/HLH6Drg')
  //   .reply(200, user1);

  // mock.onGet('http://localhost:5000/User/undefined')
  //   .reply(200, user1);

  // mock.onPatch('http://localhost:5000/User/HLH6Drg')
  //   .reply(200);

  mock.onGet('http://localhost:8080/user/suggest/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onGet('http://localhost:8080/user/haveliked/HLH6Drg?postid=1')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/likedel/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/likeadd/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onGet('http://localhost:8080/Post/1')
    .reply(200, { data: post1 });

  mock.onGet('http://localhost:8080/Post/2')
    .reply(200, { data: post2 });

  mock.onGet('http://localhost:8080/Post/3')
    .reply(200, { data: post3 });

  mock.onGet('http://localhost:8080/Post/4')
    .reply(200, { data: post4 });

  mock.onGet('http://localhost:8080/Post/5')
    .reply(200, { data: post5 });

  mock.onGet('http://localhost:8080/Post/6')
    .reply(200, { data: post6 });

  mock.onPost('http://localhost:8080/user')
    .reply(200);

  mock.onPut('http://localhost:8080/user/follownum/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/followadd/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/followdel/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/postadd/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onPut('http://localhost:8080/user/postdelete/HLH6Drg')
    .reply(200, { data: 1 });

  mock.onGet('http://localhost:8080/user/followlist/HLH6Drg')
    .reply(200, { data: user1 });

  mock.onPost('http://localhost:8080/comment')
    .reply(200);

  mock.onGet('http://localhost:8080/comment')
    .reply(200, { data: [comment1, comment2] });

  mock.onDelete('http://localhost:8080/comment/1')
    .reply(200);

  mock.onPut('http://localhost:8080/comment/1')
    .reply(200);

  mock.onGet('http://localhost:8080/comment/HLH6Drg')
    .reply(200, { data: comment1 });

  mock.onPost('http://localhost:8080/Post')
    .reply(200, { data: post1 });

  mock.onPut('http://localhost:8080/Post/1')
    .reply(200, { data: post1 });

  mock.onDelete('http://localhost:8080/Post/1')
    .reply(200);
  return mock;
}
