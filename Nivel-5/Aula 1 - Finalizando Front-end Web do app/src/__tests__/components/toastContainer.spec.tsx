import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { uuid } from 'uuidv4';
import ToastContainer from '../../components/ToastContainer';

const uuidSpy = {
  uuid,
};

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast Container', () => {
  it('should be able to remove toast message by button click', () => {
    jest.spyOn(uuidSpy, 'uuid').mockImplementation(() => '1');

    const testMessages = [
      {
        id: '1',
        title: 'test-message',
      },
    ];

    const { getByTestId } = render(<ToastContainer messages={testMessages} />);

    fireEvent.click(getByTestId('remove-toast-button'));

    expect(mockedRemoveToast).toHaveBeenCalledTimes(1);
  });
});
