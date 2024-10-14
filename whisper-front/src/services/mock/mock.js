import axiosInstance from '../axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { Chats, loginResponse, signupResponse } from './mockData'; // Import mock data

export const initializeMock = () => {
    console.log("7mbola");
    const mock = new MockAdapter(axiosInstance);
    
    mock.onPost('/login').reply(200, loginResponse);

    mock.onPost('/signup').reply(201, signupResponse);
    
    mock.onGet('/chats').reply(200,  Chats);
};
