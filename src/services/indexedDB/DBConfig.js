export const DB_CONFIG = {
    name: 'WhisperApp',
    version: 6,
    stores: {
        chats: {
            name: 'chats',
            keyPath: 'id',
            indexes: []
        },
        messages: {
            name: 'messages',
            keyPath: 'id',
            indexes: [{ name: 'chatId', keyPath: 'chatId', options: { unique: false } }]
        },
        pinnedmessages: {
            name: 'pinnedmessages',
            keyPath: 'messageId',
            indexes: [{ name: 'chatId', keyPath: 'chatId', options: { unique: false } }]
        },
        stories: {
            name: 'stories',
            keyPath: 'id',
            indexes: [{ name: 'userId', keyPath: 'userId', options: { unique: false } }]
        },
        stories_temp: {
            name: 'stories_temp',
            keyPath: 'userId',
            indexes: [{ name: 'userId', keyPath: 'userId', options: { unique: true } }]
        },
        users: {
            name: 'users',
            keyPath: 'id',
            indexes: []
        },
        groups: {
            name: 'groups',
            keyPath: 'id',
            indexes: []
        },
    }
}
