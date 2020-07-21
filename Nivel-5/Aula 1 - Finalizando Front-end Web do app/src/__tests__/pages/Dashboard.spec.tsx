import React from 'react';
import { render, fireEvent, wait, waitFor, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Dashboard from '../../pages/Dashboard';

import api from '../../services/api';

const mockedHistoryPush = jest.fn();

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: jest.fn(),
      user: {
        id: 'test-user-id',
        name: 'test-user-name',
        avatar_url: 'test-user-avatarurl',
      },
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

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('Should be able to render Dashboard page', async () => {
    const mockedApiGet = {
      get: jest.fn(),
    };

    jest.mock('../../services/api', () => mockedApiGet);

    const { getByText } = render(<Dashboard />);

    expect(getByText('Bem-vindo,')).toBeTruthy();
  });

  it('Should be able to load the appointments', async () => {
    const mockedApi = new MockAdapter(api);
    const meUrl = '/appointments/me';
    const monthAvailabilityUrl = '/providers/test-user-id/month-availability';

    const ownedAppointments = [
      {
        id: 1,
        date: new Date(2020, 8, 17, 9),
        user: {
          id: 'user-id-1',
          name: 'Jhon',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
      {
        id: 2,
        date: new Date(2020, 8, 17, 13),
        user: {
          id: 'user-id-2',
          name: 'Fowler',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
    ];

    const monthAvailability = [
      {
        day: '17',
        available: true,
      },
      {
        day: '18',
        available: false,
      },
    ];

    mockedApi.onGet(meUrl).reply(200, ownedAppointments);
    mockedApi.onGet(monthAvailabilityUrl).reply(200, monthAvailability);

    const { getAllByText, getByText } = render(<Dashboard />);

    await wait(() => {
      expect(getByText('Bem-vindo,')).toBeTruthy();
    });

    await wait(() => {
      expect(getAllByText('Jhon')).toHaveLength(2);
      expect(getByText('Fowler')).toBeTruthy();
    });
  });

  it('Should be able to pick another date', async () => {
    const mockedApi = new MockAdapter(api);
    const meUrl = '/appointments/me';
    const monthAvailabilityUrl = '/providers/test-user-id/month-availability';

    const ownedAppointments = [
      {
        id: 1,
        date: new Date(2020, 8, 17, 9),
        user: {
          id: 'user-id-1',
          name: 'Jhon',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
      {
        id: 2,
        date: new Date(2020, 8, 17, 13),
        user: {
          id: 'user-id-2',
          name: 'Fowler',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
    ];

    const monthAvailability = [
      {
        day: '17',
        available: true,
      },
      {
        day: '18',
        available: false,
      },
    ];

    mockedApi.onGet(meUrl).reply(200, ownedAppointments);
    mockedApi.onGet(monthAvailabilityUrl).reply(200, monthAvailability);

    const { getByText } = render(<Dashboard />);

    await wait(() => {
      expect(getByText('Bem-vindo,')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(getByText('20'));
    });

    await wait(() => {
      expect(getByText('Dia 20 de julho')).toBeTruthy();
    });
  });

  it('Should be able to pick another date', async () => {
    const mockedApi = new MockAdapter(api);
    const meUrl = '/appointments/me';
    const monthAvailabilityUrl = '/providers/test-user-id/month-availability';

    const ownedAppointments = [
      {
        id: 1,
        date: new Date(2020, 8, 17, 9),
        user: {
          id: 'user-id-1',
          name: 'Jhon',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
      {
        id: 2,
        date: new Date(2020, 8, 17, 13),
        user: {
          id: 'user-id-2',
          name: 'Fowler',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
    ];

    const monthAvailability = [
      {
        day: '17',
        available: true,
      },
      {
        day: '18',
        available: false,
      },
    ];

    mockedApi.onGet(meUrl).reply(200, ownedAppointments);
    mockedApi.onGet(monthAvailabilityUrl).reply(200, monthAvailability);

    const { getByText } = render(<Dashboard />);

    await wait(() => {
      expect(getByText('Bem-vindo,')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(getByText('20'));
    });

    await wait(() => {
      expect(getByText('Dia 20 de julho')).toBeTruthy();
    });
  });

  it('Should be able to pick next month', async () => {
    const mockedApi = new MockAdapter(api);
    const meUrl = '/appointments/me';
    const monthAvailabilityUrl = '/providers/test-user-id/month-availability';

    const ownedAppointments = [
      {
        id: 1,
        date: new Date(2020, 8, 17, 9),
        user: {
          id: 'user-id-1',
          name: 'Jhon',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
      {
        id: 2,
        date: new Date(2020, 8, 17, 13),
        user: {
          id: 'user-id-2',
          name: 'Fowler',
          email: 'updated@email.com',
          avatar_url: 'updated-image.png',
        },
      },
    ];

    const monthAvailability = [
      {
        day: '17',
        available: true,
      },
      {
        day: '18',
        available: false,
      },
    ];

    mockedApi.onGet(meUrl).reply(200, ownedAppointments);
    mockedApi.onGet(monthAvailabilityUrl).reply(200, monthAvailability);

    const { getByText, container } = render(<Dashboard />);

    await wait(() => {
      expect(getByText('Bem-vindo,')).toBeTruthy();
    });

    const datePicker = container.querySelector('[aria-label="Next Month"]');

    if (datePicker) {
      await act(async () => {
        fireEvent.click(datePicker);
      });
    }

    await act(async () => {
      fireEvent.click(getByText('10'));
    });

    await wait(() => {
      expect(getByText('Dia 10 de agosto')).toBeTruthy();
    });
  });
});
