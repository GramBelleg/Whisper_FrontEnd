import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import {
  signupResponse,
  loginResponse,
  forgotPasswordResponse,
  verifyResponse,
  resetPasswordResponse,
} from './AuthMockData';
import authRoutes from '../utils/APIRoutes';

export const initializeMock = () => {
  const mock = new MockAdapter(axiosInstance);

  mock.onPost(authRoutes.login).reply(200, loginResponse);

  mock.onPost(authRoutes.signup).reply(201, signupResponse);

  mock.onPost(authRoutes.confirmEmail).reply(201, verifyResponse);

  mock.onPost(authRoutes.sendResetCode).reply(200, forgotPasswordResponse);

  mock.onPost(authRoutes.resetPassword).reply(200, resetPasswordResponse);
};
