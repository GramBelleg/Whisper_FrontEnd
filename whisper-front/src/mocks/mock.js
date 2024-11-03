import axiosInstance from '../services/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { storiesData, uploadLink, downloadLink, chatList, messages, myStories } from './mockData'; // Import mock data
import { storiesData, uploadLink, downloadLink, chatList, messages } from './mockData'; // Import mock data
import { blockedUsersAPI } from '@/services/blockedUsersService';
import { blockedUsers } from './BlockedUsersData';



export const initializeMock = () => {
    const mock = new MockAdapter(axiosInstance);
    mock.onGet('/stories').reply(200, storiesData);
    mock.onGet('/uploadAttachment').reply(200,uploadLink);
    mock.onGet('/downloadAttachment').reply(200,downloadLink);
    mock.onGet(blockedUsersAPI.index).reply(200,blockedUsers);
    mock.onGet('/chats').reply(200, chatList);
    mock.onGet('/chatMessages').reply(200, messages);
    mock.onGet('/myStories').reply(200, myStories);

    mock.onPut('/myStories').reply(config => {
        const newStory = JSON.parse(config.data); // Parse the new story data from the request body
        myStories.stories.push(newStory);         // Add it to the mock data

        console.log(myStories)
        return [200, newStory];                   // Respond with the new story data
    });

};


/*
    mock.onPost('/login').reply(200, loginResponse);
    mock.onPost('/signup').reply(201, signupResponse);
    mock.onGet('/stories').reply(200, storiesData);

    mock.onPost(authRoutes.login).reply(200, loginResponse);
    mock.onPost(authRoutes.signup).reply(201, signupResponse);
    mock.onPost(authRoutes.confirmEmail).reply(201, verifyResponse);
    mock.onPost(authRoutes.sendResetCode).reply(200, forgotPasswordResponse);
    mock.onPost(authRoutes.resetPassword).reply(200, resetPasswordResponse);
*/
