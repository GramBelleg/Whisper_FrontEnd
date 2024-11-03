import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { storiesData, uploadLink, downloadLink } from './mockData'; // Import mock data
import { blockedUsersAPI } from '@/services/blockedUsersService';
import { blockedUsers } from './BlockedUsersData';

export const initializeMock = () => {
    const mock = new MockAdapter(axiosInstance);
    console.log("7mbola");
    mock.onGet('/stories').reply(200, storiesData);
    mock.onGet('/uploadAttachment').reply(200,uploadLink);
    mock.onGet('/downloadAttachment').reply(200,downloadLink);
    mock.onGet(blockedUsersAPI.index).reply(200,blockedUsers);

};


/*
    const mock = new MockAdapter(axiosInstance);
    mock.onPost('/login').reply(200, loginResponse);
    mock.onPost('/signup').reply(201, signupResponse);
    mock.onGet('/stories').reply(200, storiesData);

    mock.onPost(authRoutes.login).reply(200, loginResponse);
    mock.onPost(authRoutes.signup).reply(201, signupResponse);
    mock.onPost(authRoutes.confirmEmail).reply(201, verifyResponse);
    mock.onPost(authRoutes.sendResetCode).reply(200, forgotPasswordResponse);
    mock.onPost(authRoutes.resetPassword).reply(200, resetPasswordResponse);
*/
