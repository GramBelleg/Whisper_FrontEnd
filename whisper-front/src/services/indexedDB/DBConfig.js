export const DB_CONFIG = {
    name: 'WhisperApp',
    version: 4,
    stores: {
        chats: {
            name: 'chats',
            keyPath: 'id',
            indexes:[]
        },
        messages: {
            name: 'messages',
            keyPath: 'id',
            indexes: [
                { name: 'chatId', keyPath: 'chatId', options: { unique: false } }
            ]
        },
        pinnedmessages : {
            name : 'pinnedmessages',
            keyPath : 'id',
            indexes : [
                { name: 'chatId', keyPath: 'chatId', options: { unique: false } }
            ]
        },
        stories: {
            name: 'stories',
            keyPath: 'id',
            indexes: []
        }
    }
};
