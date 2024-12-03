import axiosInstance from '../services/axiosInstance'
import MockAdapter from 'axios-mock-adapter'
import { storiesData, uploadLink, downloadLink, chatList, messages, myStories } from './mockData' // Import mock data
import { blockedUsersAPI } from '@/services/blockedUsersService'
import { blockedUsers } from './BlockedUsersData'

export const initializeMock = () => {
    const mock = new MockAdapter(axiosInstance)
    mock.onGet('/stories').reply(200, storiesData)
    mock.onGet('/uploadAttachment').reply(200, uploadLink)
    mock.onGet('/downloadAttachment').reply(200, downloadLink)

    mock.onPost('/api/media/write').reply(200, uploadLink)
    mock.onPost('/api/media/read').reply(200, downloadLink)

    mock.onPost('/api/stickers').reply(200, {
        stickers: ['11732368155588.string']
    })

    mock.onGet(blockedUsersAPI.index).reply(200, blockedUsers)
    mock.onPut(blockedUsersAPI.update).reply((config) => {
        const { users, blocked } = JSON.parse(config.data)
        if (blocked) {
            blockedUsers.push({
                userId: users[0],
                profilePic: 'https://ui-avatars.com/api/?name=John+Doe',
                userName: 'User ' + users[0]
            })
        } else {
            const index = blockedUsers.findIndex((user) => user.id === users[0])
            blockedUsers.splice(index, 1)
        }
        return [
            200,
            {
                status: 'success'
            }
        ]
    })
    mock.onGet('/chats').reply(200, chatList)
    //mock.onGet('/chatMessages').reply(200, messages);
    mock.onGet(new RegExp(`/chatMessages/\\d+`)).reply((config) => {
        const id = parseInt(config.url.split('/').pop()) // Extract the chatId from the URL
        const filteredMessages = messages.filter((msg) => msg.messages[0].chatId === id)
        if (filteredMessages.length > 0) {
            return [200, filteredMessages[0]]
        } else {
            return [404, { message: 'Chat ID not found' }]
        }
    })
    mock.onGet('/myStories').reply(200, myStories)

    mock.onPut('/myStories').reply((config) => {
        const newStory = JSON.parse(config.data) // Parse the new story data from the request body
        myStories.stories.push(newStory) // Add it to the mock data

        console.log(myStories)
        return [200, newStory] // Respond with the new story data
    })

    mock.onDelete('/myStories').reply((config) => {
        // Extract the story ID from the request URL
        const url = new URL(config.url, 'http://localhost')
        const storyId = url.searchParams.get('id') // Assuming the ID is passed as a query parameter

        if (!storyId) {
            return [400, { status: 'failed', message: 'Story ID is required.' }]
        }

        // Convert the storyId to a number, since IDs in `myStories` are numbers
        const storyIdNumber = Number(storyId)

        // Find the index of the story with the matching ID
        const storyIndex = myStories.stories.findIndex((story) => story.id === storyIdNumber)

        if (storyIndex === -1) {
            return [404, { status: 'failed', message: 'Story not found.' }]
        }

        // Remove the story from the list
        myStories.stories.splice(storyIndex, 1)

        console.log(myStories) // Log the updated list of stories

        return [200, { status: 'success', message: 'Story deleted successfully.' }]
    })

    mock.onPut('/updateUsername').reply(400, {
        status: 'failed',
        message: 'Username must be unique.'
    })
    mock.onPut('/updateName').reply(200, {
        status: 'success'
    })
    mock.onPut('/updateBio').reply(200, {
        status: 'success'
    })
    mock.onPut('/updatePhone').reply(400, {
        status: 'failed',
        message: 'Phone format is wrong.'
    })
    mock.onPut('/sendUpdateCode').reply(200, {
        status: 'failed',
        message: 'Email is already used'
    })
    mock.onPut('/updateEmail').reply(200, {
        status: 'failed',
        message: 'Invalid Code'
    })
    mock.onGet('/api/user/logoutOne').reply(200, {
        status: 'success'
    })
}

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
