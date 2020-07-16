import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, getByText } from '@testing-library/react';
import { useToast, ToastProvider } from 'src/hooks/toast';
import MockAdapter from 'axios-mock-adapter';
import api from 'src/services/api';
import ToastContainer from 'src/components/ToastContainer';
import { string } from 'yup';

const apiMock = new MockAdapter(api);

describe('Toast Hook', () => {
  it('Should be able to show a toast message', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    result.current.addToast({
      type: 'success',
      title: 'add-toast-test-title',
      description: 'add-toast-test-description',
    });

    await waitForNextUpdate();

    // const { getByText } = render(
    //   <ToastContainer
    //     messages={[
    //       {
    //         id: 'toast-test-id-01',
    //         type: 'success',
    //         title: 'add-toast-test-title',
    //         description: 'add-toast-test-description',
    //       },
    //     ]}
    //   />,
    // );

    expect(getByText(strongElement, 'add-toast-test-title')).toBeTruthy();
  });

  // it('Should restore saved data from storage when auth inits', () => {
  //   jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
  //     switch (key) {
  //       case '@GoBarber:token':
  //         return 'token-123';
  //       case '@GoBarber:user':
  //         return JSON.stringify({
  //           id: 'user-123',
  //           name: 'John Doe',
  //           email: 'johndoe@example.com.br',
  //         });
  //       default:
  //         return null;
  //     }
  //   });

  //   const { result } = renderHook(() => useAuth(), {
  //     wrapper: AuthProvider,
  //   });

  //   expect(result.current.user.email).toEqual('johndoe@example.com.br');
  // });

  // it('Should be able to sign out', async () => {
  //   jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
  //     switch (key) {
  //       case '@GoBarber:token':
  //         return 'token-123';
  //       case '@GoBarber:user':
  //         return JSON.stringify({
  //           id: 'user-123',
  //           name: 'John Doe',
  //           email: 'johndoe@example.com.br',
  //         });
  //       default:
  //         return null;
  //     }
  //   });

  //   const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

  //   const { result } = renderHook(() => useAuth(), {
  //     wrapper: AuthProvider,
  //   });

  //   act(() => {
  //     result.current.signOut();
  //   });

  //   expect(removeItemSpy).toHaveBeenCalledTimes(2);
  //   expect(result.current.user).toBeUndefined();
  // });

  // it('Should be able to update user data', () => {
  //   const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

  //   const { result } = renderHook(() => useAuth(), {
  //     wrapper: AuthProvider,
  //   });

  //   const user = {
  //     id: 'user-123',
  //     name: 'John Doe',
  //     email: 'johndoe@example.com.br',
  //     avatar_url: 'image-test.jpg',
  //   };

  //   act(() => {
  //     result.current.updateUser(user);
  //   });

  //   expect(setItemSpy).toHaveBeenCalledWith(
  //     '@GoBarber:user',
  //     JSON.stringify(user),
  //   );

  //   expect(result.current.user).toEqual(user);
  // });
});
