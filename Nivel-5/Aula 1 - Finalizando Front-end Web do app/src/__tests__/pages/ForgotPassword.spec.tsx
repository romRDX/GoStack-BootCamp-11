import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { object } from 'yup';
import ForgotPassword from '../../pages/ForgotPassword';
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

  it('Should be able to send a forgot password email', async () => {
    mockedApi.onPost('/password/forgot').reply(200);

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);

    const newEmailField = getByPlaceholderText('E-mail');

    fireEvent.change(newEmailField, {
      target: { value: 'test-email@example.com' },
    });

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('Should not be able to send forgot password email with non existing email', async () => {
    mockedApi.onPost('/password/forgot').reply(400);

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);

    const newEmailField = getByPlaceholderText('E-mail');

    fireEvent.change(newEmailField, {
      target: { value: 'test-email@example.com' },
    });

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });

  it('should not be able to send forgot password email with invalid e-mail', async () => {
    mockedApi.onPost('/password/forgot').reply(200);

    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);

    const newEmailField = getByPlaceholderText('E-mail');

    fireEvent.change(newEmailField, {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });
});
