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
        sender:"Ziad",
        name:"Ziad Samer Mohamed Tawfik Radwan Gabr Aly",
        profile_pic:"",
        last_seen: "12:00:00",
        muted: true,
        message:"hello",
        message_state:"delivered",
        message_time:"2024-10-12 05:50:50",
        message_type:"text",
        unread_notifications: 101,
        tagged: false,
        group: false,
        story: false,
        
    },
    {
        sender: "John",
        name: "Zeyad Dawood",
        profile_pic: "./assets/images/Grambell.png",
        last_seen: "10:00",
        muted: false,
        message: "ezyaka ysta, enta kont fen? bklmk mn embar7 telephonak m2fol mn embar7",
        message_state: "delivered",
        message_time: "2024-10-11 04:21:21",
        message_type: "text",
        unread_notifications: 0,
        tagged: false,
        group: false,
        story: true,
    },
    {
        sender: "John",
        name: "Amr Saad",
        profile_pic: "./assets/images/Grambell.png",
        last_seen: "10:00",
        muted: false,
        message: "ezyaka ysta.",
        message_state: "sent",
        message_time: "2024-10-11 04:21:21",
        message_type: "text",
        unread_notifications: 0,
        tagged: false,
        group: false,
        story: true,
    },
    {
        sender: "John",
        name: "Amr Mahmoud",
        profile_pic: "./assets/images/barcelona.png",
        last_seen: "12:00",
        muted: false,
        message: "https://server11.mp3quran.net/yasser/001.mp3",
        message_state: "read",
        message_time: "2024-10-10 06:50:21",
        message_type: "audio",
        unread_notifications: 0,
        tagged: false,
        group: false,
        story: false,
    },
    {
        sender: "Hana",
        name: "Fatma Zenhom",
        profile_pic: "./assets/images/messi.jpg",
        last_seen: "12:00",
        muted: false,
        message: "https://server11.mp3quran.net/yasser/001.mp3",
        message_state: "deleted",
        message_time: "2023-09-11 11:48:12",
        message_type: "audio",
        unread_notifications: 1,
        tagged: false,
        group: false,
        story: false,
    },
    {
        sender: "John",
        name: "Hana Mostafa",
        profile_pic: "./assets/images/ronaldo.jpeg",
        last_seen: "12:00",
        muted: true,
        message: "Ronaldo 2023",
        message_state: "read",
        message_time: "2024-10-12 05:50:50",
        message_type: "video",
        unread_notifications: 0,
        tagged: false,
        group: false,
        story: false,
    },
    {
        sender: "John",
        name: "Seif Mohamed",
        profile_pic: "./assets/images/Real_Madrid_CF.png",
        last_seen: "12:00",
        muted: false,
        message: "Ronaldo 2023",
        message_state: "deleted",
        message_time: "2024-10-12 02:10:29",
        message_type: "sticker",
        unread_notifications: 0,
        tagged: false,
        group: true,
        story: false
    },
    {
        sender: "John",
        name: "Karim Mohamed",
        profile_pic: "./assets/images/ronaldo.jpeg",
        last_seen: "12:00",
        muted: false,
        message: "Ronaldo 2023",
        message_state: "read",
        message_time: "2022-07-12 02:10:29",
        message_type: "sticker",
        unread_notifications: 0,
        tagged: false,
        group: false,
        story: true,
    },
    {
        sender: "Ashraf",
        name: "Karim Mahmoud",
        profile_pic: "./assets/images/Grambell.png",
        last_seen: "10:00",
        muted: false,
        message: "ايه الاخبار؟",
        message_state: "nothing",
        message_time: "2024-10-11 04:21:21",
        message_type: "text",
        unread_notifications: 2,
        tagged: false,
        group: false,
        story: false,
    },
    {
        sender: "Adham",
        name: "Karim abosamra",
        profile_pic: "./assets/images/Grambell.png",
        last_seen: "10:00",
        muted: true,
        message: "el leader ely m4rfna",
        message_state: "nothing",
        message_time: "2024-10-11 04:21:21",
        message_type: "image",
        unread_notifications: 2,
        tagged: false,
        group: false,
        story: false,
    },


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


export const userDetails = {
    id: 1,
    name: 'John Doe',
    profile_pic: './assets/images/Grambell.png',
    last_seen_at: '10:00:50'
};


export const messagesForUser  = [
    {
        content: "Astonishing!",
        chatId: 3,
        type: "text",
        forwarded: false,
        selfDestruct: true,
        expiresAfter: 5,
        parentMessageId: null,
        sender: 1,
        time:'12:50',
        state:"delivered"
    },
    {
        content: "I plan to go to Norway, Tom said that you can tell about interesting places. I am very interested in the city of Stavanger. Have you been to this city?",
        chatId: 3,
        type: "text",
        forwarded: false,
        selfDestruct: true,
        expiresAfter: 5,
        parentMessageId: null,
        sender: 2,
        time : '12:51',
        state: 'read'
    }
]
