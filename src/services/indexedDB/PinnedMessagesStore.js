import { BaseStore } from "./BaseStore";

import { whoAmI } from "../chatservice/whoAmI";

export class PinnedMessagesStore extends BaseStore {
    constructor(db) {
        super(db, 'pinnedmessages');
    }

    async insertPinnedMessages(chatId, messages) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const tx = this.db.transaction('pinnedmessages', 'readwrite');
                const store = tx.objectStore('pinnedmessages');
                messages.forEach(message => { 
                    store.add({
                        content: message.content, 
                        chatId: chatId,
                        messageId: message.id
                    })
                });
                ;
                console.log('Pinned Messages inserted successfully!');
            }
            catch (error) {
                console.error('Error inserting messages:', error);
            }
        });
    }

    async pinMessage(message) {
        return this._executeTransaction('readwrite', async (store) => {
            try {                
                const messageRequest = store.add({
                    messageId: message.pinnedMessage,
                    chatId: message.chatId,
                    content: message.content,
                });
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });

                ; 
                console.log('Pinned Message inserted successfully.');
            } catch (error) {
                console.error('Failed to insert pinned message:', error);
                throw new Error('Failed to insert pinned message: ' + error.message);
            }
        });
    }

    async unPinMessage(messageId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const messageRequest = store.delete(messageId);
    
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve();
                    messageRequest.onerror = () => reject(messageRequest.error);
                });

                ; 
                console.log('Message unpinned from Indexed successfully.');
            } catch (error) {
                console.error('Failed to unpin message:', error);
                throw new Error('Failed to unpin message: ' + error.message);
            }
        });
    }

    async getPinnedMessagesForChat(chatId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
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
        });
    }
}