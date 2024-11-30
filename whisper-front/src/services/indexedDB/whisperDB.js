import MessagesStore from "./MessagesStore";
import ChatsStore from "./ChatsStore";
import StoriesStore from "./StoriesStore";
import { DB_CONFIG } from "./DBConfig";
import { whoAmI } from "../chatservice/whoAmI";

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

    /**
     * Deletes the WhisperDB IndexedDB database.
     * @returns {Promise<void>}
     */
    async delete() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close(); // Close any open connections to the database
            }

            const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

            deleteRequest.onsuccess = () => {
                console.log(`Database "${DB_CONFIG.name}" deleted successfully.`);
                resolve();
            };

            deleteRequest.onerror = (event) => {
                console.error(`Error deleting database "${DB_CONFIG.name}":`, event.target.error);
                reject(event.target.error);
            };

            deleteRequest.onblocked = () => {
                console.warn(`Database deletion is blocked. Please close all other tabs using this database.`);
                reject(new Error("Database deletion is blocked."));
            };
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
                return messages.reverse();
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
                return messages.reverse();
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

    async getDraftedMessage(chatId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readonly');
                const store = tx.objectStore('chats');
                const request = store.get(chatId);
                const chat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                if (chat && chat.drafted)
                    return chat.lastMessage;
                else 
                    throw new Error("Chat not found.");
            } catch (error) {
                throw new Error("Failed to get message from indexed db: " + error.message);
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
                const messageRequest = messageStore.add(message);
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });
                
                const chatRequest = chatStore.get(message.chatId);
                const chat = await new Promise((resolve, reject) => {
                    chatRequest.onsuccess = () => resolve(chatRequest.result);
                    chatRequest.onerror = () => reject(chatRequest.error);
                });

                if (chat) {
                    if (message.senderId === whoAmI.userId || (chat.drafted === false && message.senderId !== whoAmI.userId)) {
                        chat.lastMessageId = message.id;
                        chat.lastMessage = message.content;
                        chat.messageTime = message.time;
                        chat.senderId = message.senderId;
                        chat.sender = message.sender;
                        chat.messageType = message.type;
                        chat.messageState = message.state;
                        chat.media = message.media ? message.media : null;
                        chat.drafted = false;
        
                        const updateRequest = chatStore.put(chat);
                        await new Promise((resolve, reject) => {
                            updateRequest.onsuccess = () => resolve();
                            updateRequest.onerror = () => reject(updateRequest.error);
                        });
                    }
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

    async insertDraftedMessage(draftedMessage) {
        if (this.db) {
            try {
                const tx = this.db.transaction('chats', 'readwrite'); // Include both stores in the transaction
                const chatStore = tx.objectStore('chats');

                const chatRequest = chatStore.get(draftedMessage.chatId);
                const chat = await new Promise((resolve, reject) => {
                    chatRequest.onsuccess = () => resolve(chatRequest.result);
                    chatRequest.onerror = () => reject(chatRequest.error);
                });
                if (chat) {
                    chat.lastMessageId = null;
                    chat.lastMessage = draftedMessage.draftContent;
                    chat.messageTime = draftedMessage.draftTime;
                    chat.senderId = null;
                    chat.sender = null;
                    chat.messageType = null;
                    chat.messageState = null;
                    chat.media = null;
                    chat.drafted = true;
                    
    
                    const updateRequest = chatStore.put(chat);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });

                    
                } else {
                    throw new Error(`Chat with id ${message.chatId} not found`);
                }
            } catch (error) {

            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async pinMessage(message) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction(['pinnedmessages'], 'readwrite'); // Include both stores in the transaction
                const pinnedMessagesStore = tx.objectStore('pinnedmessages');    
                
                const messageRequest = pinnedMessagesStore.add({
                    messageId: message.pinnedMessage,
                    chatId: message.chatId,
                    content: message.content,
                });
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });

                await tx.complete; 
                console.log('Pinned Message inserted successfully.');
            } catch (error) {
                console.error('Failed to insert pinned message:', error);
                throw new Error('Failed to insert pinned message: ' + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async unPinMessage(messageId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction(['pinnedmessages'], 'readwrite'); 
                const pinnedMessagesStore = tx.objectStore('pinnedmessages');    
                const messageRequest = pinnedMessagesStore.delete(messageId);
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });

                await tx.complete; 
                console.log('Message unpinned from Indexed successfully.');
            } catch (error) {
                console.error('Failed to unpin message:', error);
                throw new Error('Failed to unpin message: ' + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async draftMessage(id) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('messages', 'readwrite');
                const store = tx.objectStore('messages');
                console.log(id)
                const request = store.get(id);
    
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
    
                if (existingMessage) {
                    existingMessage.drafted = true;
                    const updateRequest = store.put(existingMessage);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
    
                    console.log(`message with id ${id} was successfully updated to muted.`);
                } else {
                    throw new Error(`Message with id ${id} not found.`);
                }
    
                await tx.complete;
            } catch (error) {
                throw new Error("Failed to update message as muted: " + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async updateMessagesForPinned(id) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('messages', 'readwrite');
                const store = tx.objectStore('messages');
                const request = store.get(id);
    
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
    
                if (existingMessage) {
                    existingMessage.pinned = true;
                    const updateRequest = store.put(existingMessage);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
    
                    console.log(`Message with id ${id} was successfully updated to pinned.`);
                } else {
                    throw new Error(`Message with id ${id} not found.`);
                }
    
                await tx.complete;
            } catch (error) {
                throw new Error("Failed to update message as pinned: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async updateMessagesForUnPinned(id) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('messages', 'readwrite');
                const store = tx.objectStore('messages');
                const request = store.get(id);
    
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
    
                if (existingMessage) {
                    existingMessage.pinned = false;
                    const updateRequest = store.put(existingMessage);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
                    console.log(`Message with id ${id} was successfully updated to unpinned.`);
                } else {
                    throw new Error(`Message with id ${id} not found.`);
                }
    
                await tx.complete;
            } catch (error) {
                throw new Error("Failed to update message as unpinned: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async muteNotifications(chatId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readwrite');
                const store = tx.objectStore('chats');
                console.log(chatId)
                const request = store.get(chatId);
    
                const existingChat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
    
                if (existingChat) {
                    existingChat.muted = true;
                    const updateRequest = store.put(existingChat);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
    
                    console.log(`chat with id ${chatId} was successfully updated to muted.`);
                } else {
                    throw new Error(`Chat with id ${chatId} not found.`);
                }
    
                await tx.complete;
            } catch (error) {
                throw new Error("Failed to update message as muted: " + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async unMuteNotifications(chatId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readwrite');
                const store = tx.objectStore('chats');
                const request = store.get(chatId);
    
                const existingChat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
    
                if (existingChat) {
                    existingChat.muted = false;
                    const updateRequest = store.put(existingChat);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
                    console.log(`chat with id ${chatId} was successfully updated to unmuted.`);
                } else {
                    throw new Error(`Chat with id ${chatId} not found.`);
                }
    
                await tx.complete;
            } catch (error) {
                throw new Error("Failed to update message as unmuted: " + error.message);
            }
        } else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async updateUnReadMessagesCount(chatId, count) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('chats', 'readwrite');
                const store = tx.objectStore('chats');
                const request = store.get(chatId);
                
                const existingChat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                if (existingChat) {
                    if (count)
                        existingChat.unreadMessageCount += 1;
                    else 
                        existingChat.unreadMessageCount = 0;
                    console.log(existingChat)

                    const updateRequest = store.put(existingChat);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
                    await tx.complete;
                    console.log(`chat with id ${chatId} was successfully updated to correct unread count.`);
                }
            }
            catch (error) {
            }
        } 
        else {
            throw new Error('Database connection is not initialized.');
        }
    }

    async insertStories(stories) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories_temp', 'readwrite');
                const store = tx.objectStore('stories_temp');
                stories.forEach(story => { 
                    store.add(story)
                });
                await tx.complete;
                console.log('stories inserted successfully!');
            }
            catch (error) {
                console.error('Error inserting stories:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async getStories() {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories_temp', 'readonly');
                const store = tx.objectStore('stories_temp');
                const request = store.getAll();
                const stories = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    });
                await tx.complete;
                return stories;
            }
            catch (error) {
                console.error('Error getting stories:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async deleteUserFromStories(userId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories_temp', 'readwrite');
                const store = tx.objectStore('stories_temp');
                const request = store.delete(userId);
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            }
            catch (error) {
                console.error('Error getting stories:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async getUserStories(userId) {
        if (this.db != null) {
            try {
                
                const tx = this.db.transaction('stories', 'readonly');
                const store = tx.objectStore('stories');
                const index = store.index("userId");
                console.log(userId)
                const request = index.getAll(userId);

                const stories = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                if (stories) {
                    console.log("Got user stories", stories);
                    return stories;
                }
                else {
                    throw new Error("User stories not found")
                }
                    
            }
            catch (error) {
                throw error;
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async insertUserStories(stories, userId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readwrite');
                const store = tx.objectStore('stories');
                console.log(stories);
                stories.forEach(story => { 
                    store.add({
                        ...story,
                        userId: userId,
                    });
                });
                await tx.complete;
                console.log('stories inserted successfully!');
            }
            catch (error) {
                console.error('Error inserting stories:', error);
            }
        }
        else {
            throw new Error("Database is not initialized");
        }
    }

    async getStory(id) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readonly'); 
                const store = tx.objectStore('stories'); 
                const request = store.get(id); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
                return story;
            } catch (error) {
                throw new Error("Failed to get stories from indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async storyExists(id) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readonly'); 
                const store = tx.objectStore('stories'); 
                const request = store.get(id); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
                if (story) {
                    return true;
                }
                return false;
            } catch (error) {
                return false;
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async userHasStories(userId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories_temp', 'readonly'); 
                const store = tx.objectStore('stories_temp'); 
                const request = store.get(userId); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });

                await tx.complete;
                if (story) {
                    return true
                }
                
                return false;    
            } catch (error) {
                return false;
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async postUserStories(storyData, userData) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories_temp', 'readwrite'); 
                const store = tx.objectStore('stories_temp'); 
                const newStory = {
                    userId: storyData.userId,
                    userName : userData.userName, // TODO
                    profilePic: userData.profilePic
                };
                console.log(newStory)
                const request = store.add(newStory); 
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async postStory(story) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readwrite');
                const store = tx.objectStore('stories');
                const request = store.add(story);
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

            } catch (error) {
                throw new Error("Failed to post story into indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async deleteStory(storyId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readwrite');
                const store = tx.objectStore('stories');
                const request = store.delete(storyId);
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                throw new Error("Failed to post story into indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async likesLoaded(storyId) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readonly'); 
                const store = tx.objectStore('stories'); 
                const request = store.get(storyId); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });
                if (story && story.likes) {
                    return true;
                }
                return false
            } catch (error) {
                return false;
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async loadLikes(storyId, likes) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readwrite'); 
                const store = tx.objectStore('stories'); 
                const request = store.get(storyId); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });

                if (story) {
                    story.likes = likes;
                }
                const request2 = store.put(story);
                await new Promise((resolve, reject) => {
                    request2.onsuccess = () => resolve(request2.result);
                    request2.onerror = () => reject(request2.error);
                });

            } catch (error) {
                console.log(error);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async loadViews(storyId, views) {
        if (this.db != null) {
            try {
                const tx = this.db.transaction('stories', 'readwrite'); 
                const store = tx.objectStore('stories'); 
                const request = store.get(storyId); 
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result); 
                    request.onerror = () => reject(request.error); 
                });

                if (story) {
                    story.views = views;
                }
                const request2 = store.put(story);
                await new Promise((resolve, reject) => {
                    request2.onsuccess = () => resolve(request2.result);
                    request2.onerror = () => reject(request2.error);
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }

    async addStoryAttributes(id, storyAttributes) {
        if (this.db != null) {
            try {
                const story = this.getStory(id);
                if (story && storyAttributes) {
                    story.media = {
                        media: storyAttributes.media,
                        content: storyAttributes.content,
                        date: storyAttributes.date
                    };
                    const tx = this.db.transaction("stories", 'readwrite');
                    const storiesStore = tx.objectStore("stories");
                    const updateRequest = storiesStore.put(story);
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    });
                }
                
            } catch (error) {
                throw new Error("Failed to add story media into indexed db: " + error.message);
            }
        } else {
            throw new Error("Database connection is not initialized.");
        }
    }
}

export default WhisperDB;