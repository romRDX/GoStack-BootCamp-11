import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../../pages/Profile';
import api from '../../services/api';

const mockedApi = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedProfile = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      updateUser: jest.fn(),
      user: {
        name: 'test-name',
        email: 'test-email',
        avatar_url: 'test-avatarurl',
      },
    }),
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('Should be able to change avatar', async () => {
    mockedApi.onPatch('/users/avatar').reply(200);

    const { getByTestId } = render(<Profile />);

    const avatarUrl = getByTestId('avatar');

    fireEvent.change(avatarUrl);

    fireEvent.change(avatarUrl, {
      target: { filename: 'avatar-url' },
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('Should be able to update profile data', async () => {
    mockedApi.onPut('/profile').reply(200);

    const { getByText, getByPlaceholderText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha atual');
    const newPasswordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmar senha');

    fireEvent.change(nameField, { target: { value: 'test-name' } });
    fireEvent.change(emailField, { target: { value: 'email@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(newPasswordField, { target: { value: '1234567' } });
    fireEvent.change(confirmPasswordField, { target: { value: '1234567' } });

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('Should not be able to update profile with invalid data', async () => {
    mockedApi.onPut('/profile').reply(200);

    const { getByText, getByPlaceholderText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha atual');
    const newPasswordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmar senha');

    fireEvent.change(nameField, { target: { value: 'test-name' } });
    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordField, { target: { value: 'invalid-password' } });
    fireEvent.change(newPasswordField, {
      target: { value: 'invalid-password-2' },
    });
    fireEvent.change(confirmPasswordField, {
      target: { value: 'invalid-password-2' },
    });

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
