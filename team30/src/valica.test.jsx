import React from 'react';
// import testing library functions
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
// import axios from 'axios';
// import * as router from 'react-router';
import { act } from 'react-dom/test-utils';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import App from './App';
import CreatePost from './Pages/CreatePost';
import Activity from './Pages/Activity';
// import MentionUser from './component/mention';
import PostDetail from './Pages/PostDetail';
import SuggestList from './component/SuggestList';
import EditPost from './Pages/EditPost';

import {
  getFollowings,
  getUser,
  getUsers,
  createStudent,
  followchange,
  followadd,
  followdel,
  addlike,
  dellike,
  createComment,
  getComments,
  deleteComment,
  haveliked,
  editComment,
  getfollowsuggest,
  getComment,
  postadd2user,
  postdel2user,
} from './api/mock_api';
import {
  getPost, createUserPost, updatePost,
} from './backend/mock_api';
import mockBackendAxios, {
  user1, user2, post1, comment1, comment2,
} from './mock-backend-data';
// import axios from './axios-base';

mockBackendAxios();
// const lib = require('./Pages/Login');

test('test', async () => {
  const response = await getUser(1);
  // console.log(response);
  expect(response).toMatchObject({
    id: 1, name: 'John Smith',
  });
});

test('test api', async () => {
  const response = await getUsers();
  // console.log(response);
  expect(response).toMatchObject([user1, user2]);
});

test('test getPost', async () => {
  const response = await getPost(1);
  // console.log(response);
  expect(response).toMatchObject(post1);
});

test('test createStudent', async () => {
  const response = await createStudent('HLH6Drg');
  // console.log(response);
  expect(response).toBe(200);
});

test('test followchange', async () => {
  const response = await followchange('HLH6Drg', 1);
  expect(response.data).toBe(1);
});

test('test followadd', async () => {
  const response = await followadd('HLH6Drg', '1l1nmDQ');
  // console.log('followadd', response.data.data);
  expect(response).toBe(1);
});

test('test followdel', async () => {
  const response = await followdel('HLH6Drg', '1l1nmDQ');
  expect(response).toBe(1);
});

test('test addlike', async () => {
  const response = await addlike(1, 'HLH6Drg');
  expect(response).toBe(1);
});

test('test dellike', async () => {
  const response = await dellike(1, 'HLH6Drg');
  expect(response).toBe(1);
});

test('test createComment', async () => {
  const response = await createComment(1);
  expect(response).toBe(200);
});

test('test getComments', async () => {
  const response = await getComments();
  expect(response).toMatchObject([comment1, comment2]);
});

test('test getfollowings', async () => {
  const response = await getFollowings('HLH6Drg');
  // console.log(response);
  expect(response.following).toMatchObject(['1l1nmDQ', 'testid2', 'testid3']);
});

test('test deleteComment', async () => {
  const response = await deleteComment(1);
  expect(response).toBe(true);
});

test('test haveliked', async () => {
  const response = await haveliked(1, 'HLH6Drg');
  expect(response).toBe(1);
});

test('test editComment', async () => {
  const response = await editComment(1, 'a', 'b');
  expect(response).toBe(200);
});

test('test getfollowsuggest', async () => {
  const response = await getfollowsuggest('HLH6Drg');
  expect(response).toBe(1);
});

test('test getComment', async () => {
  const response = await getComment('HLH6Drg');
  expect(response).toMatchObject(comment1);
});

test('test postadd2user', async () => {
  const response = await postadd2user(1, 'HLH6Drg');
  expect(response).toBe(1);
});

test('test postdel2user', async () => {
  const response = await postdel2user(1, 'HLH6Drg');
  expect(response).toBe(1);
});

test('test createUserPost', async () => {
  const response = await createUserPost(post1);
  expect(response.status).toBe(200);
});

test('test updatePost', async () => {
  const response = await updatePost(post1);
  expect(response.data.data).toMatchObject(post1);
});

// test('data is added into local storage', () => {
//   const mockId = '1';
//   // const mockJson = { data: 'json data' };
//   localStorage.setItem('currentUser', JSON.stringify(mockId));
//   const response = getUserID();
//   expect(response).toEqual(JSON.parse(localStorage.getItem('currentUser')));
// });

// test('test deletePost', async () => {
//   const response = await deletePost(1);
//   expect(response.data.data).toMatchObject(post1);
// });

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// test('Login: Submit', async () => {
//   await render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>,
//   );
//   const button = screen.getByRole('button');
//   const account = screen.getByTestId('account');
//   const password = screen.getByTestId('password');
//   await userEvent.type(account, 'Hiiii');
//   await userEvent.type(password, 'Abc123!!');
//   await fireEvent.click(button);
//   // expect(mockedUsedNavigate).toHaveBeenCalledWith('/user/HLH6Drg');
// });

// snapshot testing
test('Login matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// test('Login: Enter email + password and success', async () => {
//   await render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>,
//   );
//   // const data = await lib.getUsers();
//   // expect(data.name).toBe('');
//   // create a reference to the textbox
//   // const button = screen.getByRole('button');
//   const account = screen.getByTestId('account');
//   const password = screen.getByTestId('password');
//   // type some text (ssss) into the textbox
//   await userEvent.type(account, 'Hiiii');
//   await userEvent.type(password, 'Abc123!!');
//   // assertion: verify that the text is in the textbox
//   expect(account).toHaveValue('Hiiii');
//   expect(password).toHaveValue('Abc123!!');
//   // await fireEvent.click(button);
// });

// snapshot testing
test('Activity matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <Activity />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// snapshot testing
test('Signup matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// test('Postdetail: getting post detail', async () => {
//   render(<BrowserRouter><CreatePost /></BrowserRouter>);
//   render(<BrowserRouter><PostDetail /></BrowserRouter>);
//   const postText = screen.getByTestId('confirmPostText');
//   const button = screen.getByTestId('submitPost');
//   await userEvent.type(postText, 'ABC');
//   await fireEvent.click(button);
//   const UserName = screen.getByTestId('detailPostText');
//   expect(UserName).toBeDefined();
// });

// test type event
test('Signup: Enter email + password and success', async () => {
  await render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );
  // create a reference to the textbox
  const button = screen.getByRole('button');
  const account = screen.getByTestId('account');
  const password = screen.getByTestId('password');
  const name = screen.getByTestId('name');
  const comfirmPassword = screen.getByTestId('comfirm-password');
  // type some text (ssss) into the textbox
  await userEvent.type(account, 'ssss');
  await userEvent.type(password, 'Abc123!!');
  await userEvent.type(comfirmPassword, 'Abc123!!');
  await userEvent.type(name, 'Valica');
  // assertion: verify that the text is in the textbox
  expect(account).toHaveValue('ssss');
  expect(password).toHaveValue('Abc123!!');
  expect(comfirmPassword).toHaveValue('Abc123!!');
  expect(name).toHaveValue('Valica');
  await fireEvent.click(button);
});

// test('Postdetail: getting post detail', async () => {
//   await render(<MemoryRouter><CreatePost /></MemoryRouter>);
//   await render(<MemoryRouter><PostDetail /></MemoryRouter>);
//   const postText = screen.getByTestId('confirmPostText');
//   const button = screen.getByTestId('submitPost');
//   await userEvent.type(postText, 'ABC');
//   await fireEvent.click(button);
//   const UserName = screen.getByTestId('detailPostText');
//   expect(UserName).toBeDefined();
// });

// snapshot testing
test('App matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('CreatePost matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <CreatePost />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('EditPost matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <EditPost />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('PostDetail matches snapshot', async () => {
  const component = await act(async () => renderer.create(
    <MemoryRouter>
      <PostDetail />
    </MemoryRouter>,
  ));

  const tree = component.toJSON();
  // eslint-disable-next-line no-undef
  expect(tree).toMatchSnapshot();
});

// snapshot testing
test('SuggestList matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <SuggestList />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
