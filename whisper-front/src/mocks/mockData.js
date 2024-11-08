import profilePicture from "../assets/images/Grambell.png"
export const loginResponse = {
    userId: 1,
    email: 'mock@gmail.com',
    token: 'fake-jwt-token',
};

export const signupResponse = {
    message: 'User registered successfully!',
};

export const uploadLink = {
    "presignedUrl": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A05%3A29Z&sr=b&sp=cw&sig=Ew1isHt6Xcn%2BU8FMUM9tOUMAodW%2FQW3vOPmkefOBTAQ%3D",
    "blobName": "61730487929490.string",
    //2"presignedUrl": "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T11%3A25%3A32Z&sr=b&sp=cw&sig=JVfu%2F6fTbncbvJqkcCfHqlu24OZfWw%2Fg3oSu9iqZ3Vw%3D"

  }
export const downloadLink = {
    //2"presignedUrl": "https://whisperblob.blob.core.windows.net/container1/1729533525359.webm?sv=2024-11-04&se=2024-10-31T17%3A59%3A36Z&sr=b&sp=r&sig=ClsWyg9wRIBLvHqoIB7RsEEjR7%2BbpH7gcw8hwhxktKU%3D"
    "presignedUrl": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A08%3A57Z&sr=b&sp=r&sig=%2BZkrxeMtJOPMyFJibsqTWKrPfdoNkVslDVmweZ%2F0qBw%3D"
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


export let myStories = {
    "stories" : [ 
        {
            "id": 0,
            "content": "ahmed",
            "media": "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T18%3A08%3A47Z&sr=b&sp=r&sig=McIinnmuVtRCb4Z1fPR3xqoKMT7kgwf%2FJrj5B81cE2I%3D",
            "type": "video/mp4",
            "likes": 12,
            "date": new Date(),
            "viewed": true,
            "privacy": "everyone"
        },
        
        {
            "id": 1,
            "content": "mahmoud",
            "media": "/api/container1/61730487929490.string?sv=2024-11-04&se=2024-11-11T19%3A08%3A57Z&sr=b&sp=r&sig=%2BZkrxeMtJOPMyFJibsqTWKrPfdoNkVslDVmweZ%2F0qBw%3D",
            "type": "image/png",
            "likes": 12,
            "date": new Date(),
            "viewed": true,
            "privacy": "everyone"
        }
         
    ]
}




export const chatList = [
    {
        "id": 1,
        "name": "Alice",
        "picture": "https://example.com/pictures/alice.jpg",
        "hasStory": true,
        "isMuted": false,
        "status": "Online",
        "lastSeen": "2024-11-01T18:00:00.012Z",
        "type": "DM",
        "unreadMessageCount": 2,
        "othersId": 101,
        "lastMessage": {
          "id": 1,
          "content": "Hey, are you free to chat?",
          "type": "text",
          "sentAt": "2024-11-01T18:24:00.012Z",
          "read": false,
          "delivered": true,
          "sender": {
            "id": 1,
            "userName": "Alice"
          }
        },
        "pinnedMessages": [
            {
                "id": 401,
                "content": "Important: Contract renewal discussion.",
                "type": "text",
                "sentAt": "2024-10-26T11:45:00.012Z",
                "sender": {
                    "id": 104,
                    "userName": "Dana"
                }
            },
            {
                "id": 402,
                "content": "Let's reschedule the meeting.",
                "type": "text",
                "sentAt": "2024-10-25T17:00:00.012Z",
                "sender": {
                    "id": 104,
                    "userName": "Dana"
                }
            }
        ]
    },
    {
        "id": 2,
        "name": "Bob",
        "picture": "https://example.com/pictures/bob.jpg",
        "hasStory": false,
        "isMuted": true,
        "status": "Away",
        "lastSeen": "2024-11-01T17:30:00.012Z",
        "type": "DM",
        "unreadMessageCount": 0,
        "othersId": 102,
        "lastMessage": {
            "id": 2,
            "content": "I'll be back later.",
            "type": "text",
            "sentAt": "2024-11-01T17:15:00.012Z",
            "read": true,
            "delivered": true,
            "sender": {
            "id": 102,
            "userName": "Bob"
            }
        },
        "pinnedMessages": [
            {
                "id": 401,
                "content": "Important: Contract renewal discussion.",
                "type": "text",
                "sentAt": "2024-10-26T11:45:00.012Z",
                "sender": {
                    "id": 104,
                    "userName": "Dana"
                }
            },
            {
                "id": 402,
                "content": "Let's reschedule the meeting.",
                "type": "text",
                "sentAt": "2024-10-25T17:00:00.012Z",
                "sender": {
                    "id": 104,
                    "userName": "Dana"
                }
            }
        ]
    },
    {
        "id": 3,
        "name": "Charlie",
        "picture": "https://example.com/pictures/charlie.jpg",
        "hasStory": true,
        "isMuted": false,
        "status": "At work",
        "lastSeen": "2024-11-01T16:45:00.012Z",
        "type": "DM",
        "unreadMessageCount": 5,
        "othersId": 104,
        "lastMessage": {
            "id": 3,
            "content": "Meeting starts in 10 mins.",
            "type": "text",
            "sentAt": "2024-11-01T16:35:00.012Z",
            "read": false,
            "delivered": true,
            "sender": {
            "id": 3,
            "userName": "Charlie"
            }
        }
    },
    {
        "id": 4,
        "name": "Dana",
        "picture": "https://example.com/pictures/dana.jpg",
        "hasStory": false,
        "isMuted": true,
        "status": "Do not disturb",
        "lastSeen": "2024-11-01T15:55:00.012Z",
        "type": "DM",
        "unreadMessageCount": 3,
        "othersId": 104,
        "lastMessage": {
            "id": 4,
            "content": "Call me when you're free.",
            "type": "text",
            "sentAt": "2024-11-01T15:30:00.012Z",
            "read": false,
            "delivered": false,
            "sender": {
            "id": 104,
            "userName": "Dana"
            }
        }
    },
]


export const messages = [
    {
        "id": 1,
        "chatId": 1,
        "sender": {
            "id": 1,
            "userName": "Alice",
            "profilePic": "https://example.com/pictures/alice.jpg"
        },
        "mentions": [],
        "content": "Hey, are you free to chat?",
        "media": "",
        "extension": "",
        "createdAt": "2024-11-01T18:24:00.012Z",
        "sentAt": "2024-11-01T18:24:00.012Z",
        "read": false,
        "delivered": true,
        "forwarded": false,
        "pinned": false,
        "selfDestruct": false,
        "isAnnouncement": false,
        "expiresAfter": 0,
        "type": "text",
        "parentMessage": null,
        "comments": []
    }
]