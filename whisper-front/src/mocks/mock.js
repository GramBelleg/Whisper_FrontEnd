import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';

export const initializeMock = () => {
  const mock = new MockAdapter(axiosInstance);

  mock.onPost('/login').reply(200, {
    userId: 1,
    email: 'mock@gmail.com',
    token: 'fake-jwt-token',
  });

  mock.onPost('/signup').reply(201, {
    message: 'User registered successfully!',
  });
};