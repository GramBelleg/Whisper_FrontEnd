import profilePicture from '../../assets/images/Grambell.png'
export const loginResponse = {
    userId: 1,
    email: 'mock@gmail.com',
    token: 'fake-jwt-token'
}

export const signupResponse = {
    message: 'User registered successfully!'
}

// Chat List  API Response
export const Chats = [
    {
        id: 1,
        senderId: 2,
        type: 'DM',
        unreadMessageCount: 101,
        lastMessageId: 1,
        lastMessage: 'hello',
        name: 'Lionel Messi',
        lastSeen: '12:00:00',
        muted: false,
        messageState: 'nothing',
        messageTime: '2024-10-12 05:50:50',
        messageType: 'text',
        tagged: false,
        group: false,
        story: false,
        othersId: 2,
        profilePic: './assets/images/messi.jpg'
    },
    {
        id: 2,
        senderId: 3,
        type: 'DM',
        unreadMessageCount: 0,
        lastMessageId: 1,
        lastMessage: 'hello',
        name: 'Cristiano Ronaldo',
        lastSeen: '12:00:00',
        muted: false,
        messageState: 'nothing',
        messageTime: '2024-10-12 05:50:50',
        messageType: 'text',
        tagged: false,
        group: false,
        story: false,
        othersId: 3,
        profilePic: './assets/images/ronaldo.jpeg'
    }
]
// export const uploadLink = {
//     "presignedUrl": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A05%3A29Z&sr=b&sp=cw&sig=Ew1isHt6Xcn%2BU8FMUM9tOUMAodW%2FQW3vOPmkefOBTAQ%3D",
//     "blobName": "61730487929490.string",

//   }
// export const downloadLink = {
//     "presignedUrl": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A08%3A57Z&sr=b&sp=r&sig=%2BZkrxeMtJOPMyFJibsqTWKrPfdoNkVslDVmweZ%2F0qBw%3D"
// }
export const downloadLink = {
    presignedUrl:
        '/api/container1/11732368155588.string?sv=2024-11-04&se=2024-12-03T13%3A26%3A58Z&sr=b&sp=r&sig=I3WYW%2Fc9ecRaAyBBTHSlsA52idArcOzY8ueCZaLchv0%3D'
}
export const uploadLink = {
    presignedUrl:
        '/api/container1/11732368155588.string?sv=2024-11-04&se=2024-12-03T13%3A22%3A35Z&sr=b&sp=cw&sig=5nf6q%2BsJsBl6BVIyZMyJA6OASLjo3Vh85BMIF8Lu56c%3D',
    blobName: '11732368155588.string'
}
export const storiesData = [
    { userId: 1, user: 'amr', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from amr' },
    { userId: 2, user: 'zeyad', profilePicture: profilePicture, seen: false, date: '1/2/2022', content: 'hello from zeyad' },
    { userId: 3, user: 'ziad', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from ziad' },
    { userId: 4, user: 'fatma', profilePicture: profilePicture, seen: false, date: '1/2/2022', content: 'hello from fatma' },
    { userId: 5, user: 'hana', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from hana' },
    { userId: 6, user: 'amr', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from amr' },
    { userId: 7, user: 'zeyad', profilePicture: profilePicture, seen: false, date: '1/2/2022', content: 'hello from zeyad' },
    { userId: 8, user: 'ziad', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from ziad' },
    { userId: 9, user: 'fatma', profilePicture: profilePicture, seen: false, date: '1/2/2022', content: 'hello from fatma' },
    { userId: 10, user: 'hana', profilePicture: profilePicture, seen: true, date: '1/2/2022', content: 'hello from hana' }
]
export const mockUsers = [
    {
        id: 1,
        email: "lionel.messi@example.com",
        userName: "leo_messi",
        name: "Lionel Messi",
        phoneNumber: "+1234567890",
        profilePic: "21733843980832.image/jpeg",
        ban: false
    },
    {
        id: 2,
        email: "cristiano.ronaldo@example.com", 
        userName: "cr7_official",
        name: "Cristiano Ronaldo",
        phoneNumber: "+0987654321",
        profilePic: "21733845642025.image/jpeg",
        ban: false
    },
    {
        id: 3,
        email: "neymar.jr@example.com",
        userName: "neymar_jr",
        name: "Neymar Jr",
        phoneNumber: "+1122334455",
        profilePic: "21733843980832.image/jpeg",
        ban: true
    },
    {
        id: 4,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 5,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 6,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 7,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 8,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 9,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 10,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 11,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 12,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 13,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 14,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 15,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 16,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    },
    {
        id: 17,
        email: "kylian.mbappe@example.com",
        userName: "mbappe_k",
        name: "Kylian Mbappé",
        phoneNumber: "+6677889900",
        profilePic: "21733844034929.image/jpeg",
        ban: true
    }
]

export const mockGroups = [
    {
        id: 1,
        name: "Football Legends",
        picture: "21733844034929.image/jpeg",
        filter: false
    },
    {
        id: 2,
        name: "World Cup Winners",
        picture: "21733844034929.image/jpeg",
        filter: false
    },
    {
        id: 3,
        name: "PSG Squad",
        picture: "21733844034929.image/jpeg",
        filter: true
    },
    {
        id: 4,
        name: "PSG Squad",
        picture: "21733844034929.image/jpeg",
        filter: true
    }
]
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
]

export const messagesForChat = [
    {
        id: 2,
        chatId: 1,
        senderId: 1,
        content: 'Astonishing!',
        type: 'text',
        forwarded: false,
        selfDestruct: true,
        expiresAfter: 5,
        parentMessageId: null,
        time: '12:52',
        state: 'sent',
        othersId: 2
    },
    {
        id: 1,
        chatId: 1,
        senderId: 2,
        content:
            'I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?',
        type: 'text',
        forwarded: false,
        selfDestruct: true,
        expiresAfter: 5,
        parentMessageId: null,
        time: '12:52',
        state: 'sent',
        othersId: 2
        // size:200,
        // fileType:1,
        // file: {type: "image/png", name: "image.png"},
        // blobname: 'x',
    }
]
