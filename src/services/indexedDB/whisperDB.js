import { MessagesStore } from './MessagesStore'
import { ChatsStore } from './ChatsStore'
import { StoriesStore } from './StoriesStore'
import { StoriesTempStore } from './StoriesTempStore'
import { PinnedMessagesStore } from './PinnedMessagesStore'
import { KeysStore } from './KeysStore'
import { UsersStore } from './UsersStore'
import { DB_CONFIG } from './DBConfig'

class WhisperDB {
    constructor() {
        if (WhisperDB.instance) {
            return WhisperDB.instance
        }

        this.db = null
        this._chats = null
        this._messages = null
        this._stories = null
        this._keys = null
        this._users = null
        WhisperDB.instance = this
    }

    static getInstance() {
        if (!WhisperDB.instance) {
            WhisperDB.instance = new WhisperDB()
        }
        return WhisperDB.instance
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version)

            request.onerror = () => {
                console.error('Error opening database:', request.error)
                reject(request.error)
            }

            request.onsuccess = () => {
                this.db = request.result
                this._initializeStores()
                resolve(this)
            }

            request.onupgradeneeded = (event) => {
                const db = event.target.result
                this._createStores(db)
            }
        })
    }

    async clearDB() {
        if (this.db) {
            console.log(Object.keys(DB_CONFIG.stores))
            const transaction = this.db.transaction(Object.keys(DB_CONFIG.stores), "readwrite");
        
            transaction.oncomplete = () => {
                console.log("All stores cleared successfully.");
            };
        
            transaction.onerror = (event) => {
                console.error("Error clearing stores:", transaction.error || event.target.error);
            };
        
            Object.values(DB_CONFIG.stores).forEach((storeConfig) => {
                const store = transaction.objectStore(storeConfig.name);
                store.clear();
            });
        } else {
            console.log("Can't Clear Stores")
        }
    }

    _initializeStores() {
        this._chats = new ChatsStore(this.db)
        this._messages = new MessagesStore(this.db)
        this._stories = new StoriesStore(this.db)
        this._stories_temp = new StoriesTempStore(this.db)
        this._pinned_messages = new PinnedMessagesStore(this.db)
        this._keys = new KeysStore(this.db)
        this._users = new UsersStore(this.db)
    }

    _createStores(db) {
        Object.values(DB_CONFIG.stores).forEach((storeConfig) => {
            if (!db.objectStoreNames.contains(storeConfig.name)) {
                const store = db.createObjectStore(storeConfig.name, {
                    keyPath: storeConfig.keyPath,
                    autoIncrement: storeConfig.autoIncrement
                })

                if (storeConfig.indexes) {
                    storeConfig.indexes.forEach((index) => {
                        store.createIndex(index.name, index.keyPath, index.options)
                    })
                }
            }
        })
    }

    getKeysStore() {
        return this._keys;
    }

    async getChat(id) {
        if (this._chats !== null) {
            return this._chats.getChat(id)
        } else {
            throw new Error('Users store is not initiaslized.')
        }
    }

    async updateChat(id,data) {
        if (this._chats !== null) {
            return this._chats.updateChat(id, data)
        } else {
            throw new Error('Users store is not initiaslized.')
        }
    }

    async insertUsers(users) {
        if (this._users !== null) {
            return this._users.insertUsers(users)
        } else {
            throw new Error('Users store is not initiaslized.')
        }
    }

    async getUsers() {
        if (this._users !== null) {
            return this._users.getUsers()
        } else {
            throw new Error('Users store is not initiaslized.')
        }
    }

    async insertChats(chats) {
        if (this._chats != null) {
            return this._chats.insertChats(chats)
        } else {
            throw new Error('Chats Store is not initialized')
        }
    }

    async insertChat(chat) {
        if (this._chats != null) {
            return this._chats.insertChat(chat)
        } else {
            throw new Error('Chats Store is not initialized')
        }
    }

    async getChats() {
        if (this._chats !== null) {
            return this._chats.getChats()
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async addGroupAdmin(chatId, userId) {
        if (this._chats !== null) {
            return this._chats.addGroupAdmin(chatId, userId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async getChatMembers(chatId) {
        if (this._chats !== null) {
            return this._chats.getChatMembers(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async getDraftedMessage(chatId) {
        if (this._chats != null) {
            return this._chats.getDraftedMessage(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async removeChat(chatId) {
        if (this._chats != null) {
            return this._chats.removeChat(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async removeChatMember(chatId, memberId) {
        if (this._chats != null) {
            return this._chats.removeChatMember(chatId, memberId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }
    async addChatMember(chatId, member) {
        if (this._chats != null) {
            return this._chats.addChatMember(chatId, member)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async insertMessageInChat(message) {
        if (this._chats !== null) {
            return this._chats.insertMessageInChat(message)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async insertDraftedMessage(chatId, draftedMessage) {
        if (this._chats !== null) {
            return this._chats.insertDraftedMessage(chatId, draftedMessage)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async unDraftMessage(chatId) {
        if (this._chats !== null) {
            return this._chats.unDraftMessage(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async muteNotifications(chatId) {
        if (this._chats !== null) {
            return this._chats.muteNotifications(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async unMuteNotifications(chatId) {
        if (this._chats !== null) {
            return this._chats.unMuteNotifications(chatId)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async updateLastMessage(chatId, data) {
        if (this._chats !== null) {
            return this._chats.updateLastMessage(chatId, data)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async updateUnreadCount(chatId, increment = false) {
        if (this._chats !== null) {
            return this._chats.updateUnreadCount(chatId, increment)
        } else {
            throw new Error('Chats store is not initiaslized.')
        }
    }

    async insertMessages(messages) {
        if (this._messages !== null) {
           await this._messages.insertMessages(messages)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
        return await this.insertMessageInChat(messages.at(-1))
    }

    async getMessagesForChat(chatId) {
        if (this._messages !== null) {
            return this._messages.getMessagesForChat(chatId)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async insertMessage(message) {
        if (this._messages !== null) {
            return this._messages.insertMessage(message)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async updateReplyCount(messageId) {
        if (this._messages !== null) {
            return this._messages.updateReplyCount(messageId)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async insertReply(replyData) {
        if (this._messages !== null) {
            return this._messages.insertReply(replyData)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async getThread(messageId) {
        if (this._messages !== null) {
            return this._messages.getThread(messageId)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async updateMessage(id, data) {
        if (this._messages !== null) {
            return this._messages.updateMessage(id, data)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async deleteMessage(id) {
        if (this._messages !== null) {
            return this._messages.deleteMessage(id)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async updateMessagesForPinned(id) {
        if (this._messages !== null) {
            return this._messages.updateMessagesForPinned(id)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async updateMessagesForUnPinned(id) {
        if (this._messages !== null) {
            return this._messages.updateMessagesForUnPinned(id)
        } else {
            throw new Error('Messages store is not initiaslized.')
        }
    }

    async getUserStories(userId) {
        if (this._stories !== null) {
            return this._stories.getUserStories(userId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async insertUserStories(stories, userId) {
        if (this._stories !== null) {
            return this._stories.insertUserStories(stories, userId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async getStory(id) {
        if (this._stories !== null) {
            return this._stories.getStory(id)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async storyExists(id) {
        if (this._stories !== null) {
            return this._stories.storyExists(id)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async postStory(story) {
        if (this._stories !== null) {
            return this._stories.postStory(story)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async addStoryBlob(storyId, blob) {
        if (this._stories !== null) {
            return this._stories.addStoryBlob(storyId, blob)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async deleteStory(storyId) {
        if (this._stories !== null) {
            return this._stories.deleteStory(storyId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async likesLoaded(storyId) {
        if (this._stories !== null) {
            return this._stories.likesLoaded(storyId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async iLiked(storyId, liked) {
        if (this._stories !== null) {
            return this._stories.iLiked(storyId, liked)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async iViewed(storyId, viewed) {
        if (this._stories !== null) {
            return this._stories.iViewed(storyId, viewed)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async isViewed(storyId) {
        if (this._stories !== null) {
            return this._stories.isViewed(storyId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async isLiked(storyId) {
        if (this._stories !== null) {
            return this._stories.isLiked(storyId)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async loadLikes(storyId, likes, increment = false) {
        if (this._stories !== null) {
            return this._stories.loadLikes(storyId, likes, increment)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async loadViews(storyId, views, increment = false) {
        if (this._stories !== null) {
            return this._stories.loadViews(storyId, views, increment)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async addStoryAttributes(id, storyAttributes) {
        if (this._stories !== null) {
            return this._stories.addStoryAttributes(id, storyAttributes)
        } else {
            throw new Error('Stories store is not initialized')
        }
    }

    async insertStories(stories) {
        if (this._stories_temp !== null) {
            return this._stories_temp.insertStories(stories)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async getStories() {
        if (this._stories_temp !== null) {
            return this._stories_temp.getStories()
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async deleteUserFromStories(userId) {
        if (this._stories_temp !== null) {
            return this._stories_temp.deleteUserFromStories(userId)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async userHasStories(userId) {
        if (this._stories_temp !== null) {
            return this._stories_temp.userHasStories(userId)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async postUserStories(storyData, userData) {
        if (this._stories_temp !== null) {
            return this._stories_temp.postUserStories(storyData, userData)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async insertPinnedMessages(chatId, messages) {
        if (this._pinned_messages !== null) {
            return this._pinned_messages.insertPinnedMessages(chatId, messages)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async pinMessage(message) {
        if (this._pinned_messages !== null) {
            return this._pinned_messages.pinMessage(message)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async unPinMessage(messageId) {
        if (this._pinned_messages !== null) {
            return this._pinned_messages.unPinMessage(messageId)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async getPinnedMessagesForChat(chatId) {
        if (this._pinned_messages !== null) {
            return this._pinned_messages.getPinnedMessagesForChat(chatId)
        } else {
            throw new Error('Stories Temp store is not initialized')
        }
    }

    async insertMessageWrapper(message) {
        try {
            await this.insertMessage(message)
        } catch (error) {
            console.log(error)
        }
        try {
            return await this.insertMessageInChat(message)
        } catch (error) {
            console.log(error)
        }
    }
}
export default WhisperDB
