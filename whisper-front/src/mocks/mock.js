import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { storiesData, uploadLink, downloadLink } from './mockData'; // Import mock data


export const initializeMock = () => {
    const mock = new MockAdapter(axiosInstance);
    console.log("7mbola");
    mock.onGet('/stories').reply(200, storiesData);
    mock.onGet('/uploadAttachment').reply(200,uploadLink);
    mock.onGet('/downloadAttachment').reply(200,downloadLink);

    mock.onPut('/updateUsername').reply(400, {
        status: "failed",
        message: "Username must be unique.",
    });
    mock.onPut('/updateName').reply(200, {
        status: "success",
    });
    mock.onPut('/updateBio').reply(200, {
        status: "success",
    });
    mock.onPut('/updatePhone').reply(400, {
        status: "failed",
        message: "Phone format is wrong.",
    });
    mock.onPut('/sendUpdateCode').reply(200, {
        status: "failed",
        message: "Email is already used",
    });
    mock.onPut('/updateEmail').reply(400, {
        status: "failed",
        message: "Invalid Code",
    });
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
