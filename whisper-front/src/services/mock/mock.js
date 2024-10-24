import axiosInstance from '../axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import { Chats, loginResponse, signupResponse, storiesData, userDetails, messagesForChat, uploadLink, downloadLink } from './mockData'; // Import mock data

export const initializeMock = () => {
    console.log("7mbola");
    const mock = new MockAdapter(axiosInstance);
    
    mock.onPost('/login').reply(200, loginResponse);

    mock.onPost('/signup').reply(201, signupResponse);
    
    mock.onGet('/chats').reply(200,  Chats);
    mock.onGet('/stories').reply(200, storiesData);
    mock.onGet('/userDetails').reply(200, userDetails);
    mock.onGet('/uploadAttachment').reply(200,uploadLink);
    mock.onGet('/downloadAttachment').reply(200,downloadLink);
    mock.onGet('/userMessages').reply(200, messagesForChat);
    mock.onPost('/userMessages').reply((config) => {
        console.log("Received POST request to /userMessages");
        try {
          const newMessage = JSON.parse(config.data);
          console.log("New message:", newMessage);
          
          // Add the new message to the top of the messagesForChat array
          messagesForChat.unshift(newMessage);
          
          
          // Return a successful response
          return [200, { message: "Message added successfully", updatedMessages: messagesForChat }];
        } catch (error) {
          console.error("Error processing message:", error);
          return [400, { error: "Invalid message format" }];
        }
      });
};
