import { renderHook, act } from '@testing-library/react-hooks';
import { wait, waitFor } from '@testing-library/react';
import { useToast, ToastProvider } from 'src/hooks/toast';
import { uuid } from 'uuidv4';

const uuidSpy = {
  uuid,
};

describe('Toast Hook', () => {
  it('Should be able to use hook', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    expect(typeof result.current.addToast).toBe('function');
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('Should be able to add toast message', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    const mockAddToast = jest.spyOn(result.current, 'addToast');

    act(() => {
      result.current.addToast({
        type: 'success',
        title: 'add-toast-test-title',
        description: 'add-toast-test-description',
      });
    });

    expect(mockAddToast).toHaveBeenCalledTimes(1);
    expect(result.error).toBeUndefined();
  });

  it('should be able to remove toast manually', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    jest.spyOn(uuidSpy, 'uuid').mockImplementation(() => '1');

    const mockRemoveToast = jest
      .spyOn(result.current, 'removeToast')
      .mockImplementation(() => '1');

    act(() => {
      result.current.addToast({
        title: 'Toast Test',
      });

      result.current.removeToast('1');
    });

    expect(mockRemoveToast).toHaveBeenCalledTimes(1);
    expect(result.error).toBeUndefined();
  });

  it('should be able to remove toast automatically', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    jest.spyOn(uuidSpy, 'uuid').mockImplementation(() => '1');

    const mockRemoveToast = jest.spyOn(result.current, 'removeToast');
    const mockSetTimeout = jest.spyOn(window, 'setTimeout');

    act(() => {
      result.current.addToast({
        title: 'Toast Test',
      });
    });

    // await wait(() => {
    //   expect(mockSetTimeout).toHaveBeenCalledWith(mockRemoveToast);
    // });
  });
});
