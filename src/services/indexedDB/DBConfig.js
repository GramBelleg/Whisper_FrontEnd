export const DB_CONFIG = {
    name: 'WhisperApp',
    version: 8,
    stores: {
        users: {
            name: 'users',
            keyPath: 'id',
        },
        keys: {
            name: 'keys',
            keyPath: 'id',
            indexes: [{ name: 'id', keyPath: 'id', options: { unique: true } }]
        },
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
        usersadmin: {
            name: 'usersadmin',
            keyPath: 'id',
            indexes: []
        },
        groups: {
            name: 'groups',
            keyPath: 'chatId',
            indexes: []
        },
    }
}
