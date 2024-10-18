import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import {signupResponse,loginResponse,forgotPasswordResponse, verifyResonse} from './AuthMockData'

export const initializeMock = () => {
  const mock = new MockAdapter(axiosInstance);

  mock.onPost('/login').reply(200, loginResponse);

  mock.onPost('/signup').reply(201, signupResponse);

  mock.onPost('/verify').reply(201, verifyResonse);

  mock.onPost('/forgot-password').reply(200, forgotPasswordResponse);

  mock.onPost('/reset-password').reply(200, {message:'Password reset successfully'});
};