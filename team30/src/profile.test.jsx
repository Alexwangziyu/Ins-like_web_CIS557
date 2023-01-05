/* eslint-disable no-undef */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import classNames from 'classnames';
import Profile from './Pages/Profile';
import TopBar from './component/TopBar';
import mockBackendAxios from './mock-backend-data';
import Likebtn from './component/Likebtn';
import Hidebtn from './component/Hidebtn';

mockBackendAxios();
describe('test Profile', () => {
  test('render <Profile /> normal case ', async () => {
    const response = await act(async () => renderer.create(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    ));
    expect(response.toJSON().length).toBe(5);
  });

  test('test click follow & unfollow btn', async () => {
    const response = await act(async () => renderer.create(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    ));
    console.log(response.toJSON().length);
    expect(response.toJSON().length).toBe(5);
  });

  test('profile matches snapshot', async () => {
    const component = await act(async () => renderer.create(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('profile matches snapshot', () => {
    const component = renderer.create(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('test click topbar', async () => {
    const { container } = render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Activity/i));
    fireEvent.click(screen.getByText(/Search/i));
    fireEvent.click(screen.getByText(/Todo/i));
    expect(container.getElementsByClassName('dropdown-item')).toHaveLength(3);
    fireEvent.click(screen.getByText(/My Profile/i));
    fireEvent.click(screen.getByText(/New Post/i));
    fireEvent.click(screen.getByText(/Log Out/i));
  });

  test('profile matches snapshot', () => {
    const component = renderer.create(
      <MemoryRouter>
        <mock_api />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('test Profile', () => {
  // eslint-disable-next-line no-undef
  test('render <Profile /> normal case ', async () => {
    // eslint-disable-next-line react/jsx-filename-extension
    const { container } = render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    const containerCls = classNames('container');
    const btnCls = classNames('btn btn-warning btn-sm active');
    // eslint-disable-next-line no-undef
    expect(container.getElementsByClassName(containerCls)).toHaveLength(5);
    // eslint-disable-next-line no-undef
    expect(container.getElementsByClassName(btnCls)).toHaveLength(1);
  });

  test('test click follow & unfollow btn', async () => {
    const { container } = render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    // init state
    expect(container.getElementsByClassName('followbtn')).toHaveLength(1);
    expect(container.getElementsByClassName('unfollowbtn')).toHaveLength(0);

    // click follow
    fireEvent.click(screen.getByText(/FOLLOW!/i));
    expect(container.getElementsByClassName('followbtn')).toHaveLength(0);
    expect(container.getElementsByClassName('unfollowbtn')).toHaveLength(1);

    // click unfollow
    fireEvent.click(screen.getByText(/UNFOLLOW!/i));
    expect(container.getElementsByClassName('followbtn')).toHaveLength(1);
    expect(container.getElementsByClassName('unfollowbtn')).toHaveLength(0);
  });

  test('profile matches snapshot', () => {
    const component = renderer.create(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('likebtn matches snapshot', () => {
    const component = renderer.create(
      <MemoryRouter>
        <Likebtn />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('hidebtn matches snapshot', () => {
    const component = renderer.create(
      <MemoryRouter>
        <Hidebtn />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
