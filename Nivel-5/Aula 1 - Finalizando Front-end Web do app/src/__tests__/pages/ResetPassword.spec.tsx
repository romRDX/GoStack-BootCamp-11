import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedApi = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

let mockedSearchValue = '';

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: mockedSearchValue,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Reset Password Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();

    mockedSearchValue = '?token=mocked-token';
  });

  it('Should be able to render reset password page', async () => {
    mockedApi.onPost('/password/reset').reply(200);

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(getByText('Alterar senha'));

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('Should be able to show toast message on server error', async () => {
    mockedApi.onPost('/password/reset').reply(400);

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(getByText('Alterar senha'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('Should not be able to reset password with invalid token', async () => {
    mockedApi.onPost('/password/reset').reply(200);
    mockedSearchValue = '';

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(getByText('Alterar senha'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('Should not be able to reset password with validation errors', async () => {
    mockedApi.onPost('/password/reset').reply(200);

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '12345' },
    });

    fireEvent.click(getByText('Alterar senha'));

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
});
