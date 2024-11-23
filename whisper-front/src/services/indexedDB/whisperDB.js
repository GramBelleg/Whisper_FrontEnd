import MessagesStore from "./MessagesStore";
import ChatsStore from "./ChatsStore";
import StoriesStore from "./StoriesStore";
import { DB_CONFIG } from "./DBConfig";

class WhisperDB {
    constructor() {
        this.db = null;
        this.chats = null;
        this.messages = null;
        this.stories = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

            request.onerror = () => { 
                console.error("Error opening database:", request.error);
                reject(request.error);
            }

            request.onsuccess = () => {
                this.db = request.result;
                this.initializeStores();
                resolve(this);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createStores(db);
            };
        });
    }

    initializeStores() {
        this.chats = new ChatsStore(this.db);
        this.messages = new MessagesStore(this.db);
        this.stories = new StoriesStore(this.db);
    }

    createStores(db) {
        Object.values(DB_CONFIG.stores).forEach(storeConfig => {
            if (!db.objectStoreNames.contains(storeConfig.name)) {
                const store = db.createObjectStore(storeConfig.name, {
                    keyPath: storeConfig.keyPath,
                    autoIncrement: storeConfig.autoIncrement
                });

                storeConfig.indexes?.forEach(index => {
                    store.createIndex(index.name, index.keyPath, index.options);
                });
            }
        });
    }

    async insertChats(chats) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readwrite');
                const store = tx.objectStore('chats');
        
                chats.forEach(chat => store.add(chat));
        
                await tx.complete;
                console.log('Chats inserted successfully!');
            } catch (error) {
                console.error('Error inserting chats:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async insertMessages(messages) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('messages', 'readwrite');
                const store = tx.objectStore('messages');
                messages.forEach(message => { 
                    store.add(message)
                });

                await tx.complete;
                
                console.log('Messages inserted successfully!');
            }
            catch (error) {
                console.error('Error inserting messages:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async insertPinnedMessages(chatId, messages) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('pinnedmessages', 'readwrite');
                const store = tx.objectStore('pinnedmessages');
                messages.forEach(message => { 
                    store.add({...message, chatId: chatId})
                });

                await tx.complete;
                
                console.log('Pinned Messages inserted successfully!');
            }
            catch (error) {
                console.error('Error inserting messages:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async getMessagesForChat(chatId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('messages', 'readonly'); 
                const store = tx.objectStore('messages'); 
                const index = store.index('chatId');
                const request = index.getAll(chatId); 
                const messages = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
                return messages;
            } catch (error) {
                throw new Error("Failed to get messages from indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async getPinnedMessagesForChat(chatId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('pinnedmessages', 'readonly'); 
                const store = tx.objectStore('pinnedmessages'); 
                const index = store.index('chatId');
                const request = index.getAll(chatId); 
                const messages = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
                return messages;
            } catch (error) {
                throw new Error("Failed to get messages from indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }
    

    async getChats() {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readonly'); 
                const store = tx.objectStore('chats'); 
                const request = store.getAll(); 
                const messages = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); // Reject on error
                });
                return messages; 
            } catch (error) {
                throw new Error("Failed to get chats from indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }


    async insertMessage(message) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction(['messages', 'chats'], 'readwrite'); // Include both stores in the transaction
                const messageStore = tx.objectStore('messages');
                const chatStore = tx.objectStore('chats');
    
                // Insert the message into the 'messages' store
                const messageRequest = messageStore.add(message);
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });
    
                // Fetch the chat object by chatId
                const chatRequest = chatStore.get(message.chatId);
                const chat = await new Promise((resolve, reject) => {
                    chatRequest.onsuccess = () => resolve(chatRequest.result);
                    chatRequest.onerror = () => reject(chatRequest.error);
                });
    
                if (chat) {
                    // Update the chat object with the lastMessage
                    chat.lastMessage = message;
    
                    const updateRequest = chatStore.put(chat);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
                } else {
                    throw new Error(`Chat with id ${message.chatId} not found`);
                }
    
                await tx.complete; // Ensure the transaction completes successfully
                console.log('Message inserted and chat updated successfully.');
            } catch (error) {
                console.error('Failed to insert message or update chat:', error);
                throw new Error('Failed to insert message or update chat: ' + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }
    

}

export default WhisperDB;