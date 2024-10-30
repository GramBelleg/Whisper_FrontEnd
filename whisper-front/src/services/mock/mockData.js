import profilePicture from "../../assets/images/Grambell.png"
export const loginResponse = {
    userId: 1,
    email: 'mock@gmail.com',
    token: 'fake-jwt-token',
};

export const signupResponse = {
    message: 'User registered successfully!',
};

// Chat List  API Response
export const Chats = [
    {
        id: 1,
        senderId: 2,
        type: "DM",
        unreadMessageCount: 101,
        lastMessageId: 1,
        lastMessage:"hello",
        name:"Lionel Messi",
        lastSeen: "12:00:00",
        muted: false,
        messageState:"nothing",
        messageTime:"2024-10-12 05:50:50",
        messageType:"text",
        tagged: false,
        group: false,
        story: false,
        othersId: 2,
        picture: './assets/images/messi.jpg',
    },
    {
        id: 2,
        senderId: 3,
        type: "DM",
        unreadMessageCount: 0,
        lastMessageId: 1,
        lastMessage:"hello",
        name:"Cristiano Ronaldo",
        lastSeen: "12:00:00",
        muted: false,
        messageState:"nothing",
        messageTime:"2024-10-12 05:50:50",
        messageType:"text",
        tagged: false,
        group: false,
        story: false,
        othersId: 3,
        picture: './assets/images/ronaldo.jpeg',
        
    },
    {
        id: 2,
        senderId: 3,
        type: "DM",
        unreadMessageCount: 0,
        lastMessageId: 1,
        lastMessage:"hello",
        name:"Cristiano Ronaldo",
        lastSeen: "12:00:00",
        muted: false,
        messageState:"nothing",
        messageTime:"2024-10-12 05:50:50",
        messageType:"text",
        tagged: false,
        group: true,
        story: false,
        othersId: 3,
        picture: './assets/images/ronaldo.jpeg',
        
    }
]
export const storiesData = [
    {userId: 1, user:"amr", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from amr"},
    {userId: 2, user:"zeyad", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from zeyad"},
    {userId: 3, user:"ziad", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from ziad"},
    {userId: 4, user:"fatma", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from fatma"},
    {userId: 5, user:"hana", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from hana"},
    {userId: 6, user:"amr", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from amr"},
    {userId: 7, user:"zeyad", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from zeyad"},
    {userId: 8, user:"ziad", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from ziad"},
    {userId: 9, user:"fatma", profilePicture: profilePicture, seen: false, date: "1/2/2022", content: "hello from fatma"},
    {userId: 10, user:"hana", profilePicture: profilePicture, seen: true, date: "1/2/2022", content: "hello from hana"},
]; 


export const userDetails = [
    {
        userId: 2,
        name: 'Lionel Messi',
        profilePic: './assets/images/messi.jpg',
        lastSeen: '10:00:50'
    },
    {
        userId: 3,
        name: 'Cristiano Ronaldo',
        profilePic: './assets/images/ronaldo.jpeg',
        lastSeen: '10:00:50'
    }
];


export const messagesForChat  = [
    {
        chatId: 1,
        data:[
            {
                id:2,
                chatId: 1,
                senderId: 1,
                sender:{
                    id: 1,
                    name: "Amr",
                },
                content: "Astonishing!",
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:'12:52',
                state:"sent",
                othersId: 2,
            },
            {
                id:1,
                chatId: 1,
                senderId: 2,
                sender:{
                    id: 2,
                    name: "John",
                },
                content: "I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?",
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:'12:52',
                state:"sent",
                othersId: 2,
            },
        ],
    },
    {
        chatId: 2,
        data:[],
    },
    {
        chatId: 3,
        data:[
            {
                id:2,
                chatId: 1,
                senderId: 1,
                sender:{
                    id: 1,
                    name: "Amr",
                },
                content: "Astonishing!",
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:'12:52',
                state:"sent",
                othersId: 2,
            },
            {
                id:1,
                chatId: 1,
                senderId: 2,
                sender:{
                    id: 2,
                    name: "John",
                },
                content: "I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?",
                type: "text",
                forwarded: false,
                selfDestruct: true,
                expiresAfter: 5,
                parentMessageId: null,
                time:'12:52',
                state:"sent",
                othersId: 2,
            },
        ],
    },
]
