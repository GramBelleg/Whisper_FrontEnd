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
        profilePic: './assets/images/messi.jpg',
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
        profilePic: './assets/images/ronaldo.jpeg',
        
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
    //vid
    "presignedUrl": "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T18%3A08%3A47Z&sr=b&sp=r&sig=McIinnmuVtRCb4Z1fPR3xqoKMT7kgwf%2FJrj5B81cE2I%3D"

}
export const uploadLink ={
    "presignedUrl": "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T11%3A25%3A32Z&sr=b&sp=cw&sig=JVfu%2F6fTbncbvJqkcCfHqlu24OZfWw%2Fg3oSu9iqZ3Vw%3D",
    "blobName": "61730546732593.string"
  }
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
        id:2,
        chatId: 1,
        senderId: 1,
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
        content: "I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?",
        type: "text",
        forwarded: false,
        selfDestruct: true,
        expiresAfter: 5,
        parentMessageId: null,
        time:'12:52',
        state:"sent",
        othersId: 2,
        // size:200,
        // fileType:1,
        // file: {type: "image/png", name: "image.png"},
        // blobname: 'x',
    },
]
