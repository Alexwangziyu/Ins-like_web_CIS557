import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import Follow from './Pages/Follow';
import mockBackendAxios from './mock-backend-data';

mockBackendAxios();

test('When user enters username it is displayed', async () => {
  render(
    <MemoryRouter>
      <Follow />
    </MemoryRouter>,
  );
  const element = screen.getByRole('textbox');
  await userEvent.type(element, 'username1');
  expect(element).toHaveValue('username1');
});

// eslint-disable-next-line no-undef
test('Follow matches snapshot', async () => {
  const component = await act(async () => renderer.create(
    <MemoryRouter>
      <Follow />
    </MemoryRouter>,
  ));

  const tree = component.toJSON();
  // eslint-disable-next-line no-undef
  expect(tree).toMatchSnapshot();
});
