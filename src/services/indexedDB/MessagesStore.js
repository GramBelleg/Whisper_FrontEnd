import { BaseStore } from './BaseStore'


export class MessagesStore extends BaseStore {
    constructor(db) {
        super(db, 'messages')
    }

    async insertMessages(messages) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                messages.forEach(async (message) => {
                    const messageRequest = store.put(message)
                    const response = await new Promise((resolve, reject) => {
                        messageRequest.onsuccess = () => resolve(messageRequest.result)
                        messageRequest.onerror = () => reject(messageRequest.error)
                    })
                })
                console.log('Messages inserted successfully!')
            } catch (error) {
                console.error('Error inserting messages:', error)
            }
        })
    }

    async getMessagesForChat(chatId) {
        return this._executeTransaction('readonly', async (store) => {
            const index = store.index('chatId')
            const request = index.getAll(chatId)
            const messages = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result)
                request.onerror = () => reject(request.error)
            })
            return messages.reverse()
        })
    }

    async getMessage(id) {
        return this._executeTransaction('readonly', async (store) => {
            const request = store.get(id)
            const message = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result)
                request.onerror = () => reject(request.error)
            })
            return message
        })
    }

    async getAllImages(query) {
        return this._executeTransaction('readonly', async (store) => {
            const request = store.getAll()
            const messages = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result)
                request.onerror = () => reject(request.error)
            })
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
            const images = messages.filter(message => {
                if (message.attachmentName && message.attachmentName.length > 0) {
                    const extension = message.attachmentName.split('.').pop().toLowerCase();
                    const containsQuery = message.attachmentName.split('.')[0].toLowerCase().includes(query.toLowerCase());
                    return imageExtensions.includes(extension) && containsQuery;
                }
                return false
            });
            return images
        })
    }

    async getAllVideos(query) {
        return this._executeTransaction('readonly', async (store) => {
            const request = store.getAll()
            const messages = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result)
                request.onerror = () => reject(request.error)
            })
            const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'webm'];
            const videos = messages.filter(message => {
                if (message.attachmentName) {
                    const extension = message.attachmentName.split('.').pop().toLowerCase();
                    const containsQuery = message.attachmentName.toLowerCase().includes(query.toLowerCase());
                    return videoExtensions.includes(extension) && containsQuery;
                }
                return false;
            });

            return videos
        })
    }

    async insertMessage(message) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                console.log(message)
                const check = store.get(message.id)
                const res = await new Promise((resolve, reject) => {
                    check.onsuccess = () => resolve()
                    check.onerror = () => reject(check.error)
                })
                if (res) {
                    return
                }
                const messageRequest = store.add(message)
                await new Promise((resolve, reject) => {
                    messageRequest.onsuccess = () => resolve()
                    messageRequest.onerror = () => reject(messageRequest.error)
                })

                console.log('Message inserted and chat updated successfully.')
            } catch (error) {
                console.error('Failed to insert messag:', error)
                throw new Error('Failed to insert message or update chat: ' + error.message)
            }
        })
    }

    async updateReplyCount(messageId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(messageId)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingMessage) {
                    existingMessage.replyCount++
                    const newRequest = store.put(existingMessage)
                    await new Promise((resolve, reject) => {
                        newRequest.onsuccess = () => resolve(newRequest.result)
                        newRequest.onerror = () => reject(newRequest.error)
                    })
                }

            } catch (error) {
                console.error('Failed to insert messag:', error)
                throw new Error('Failed to insert message or update chat: ' + error.message)
            }
        })
    }

    async insertReply(replyData) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(replyData.messageId)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingMessage) {
                    existingMessage.replies.push({...replyData})
                    const newRequest = store.put(existingMessage)
                    await new Promise((resolve, reject) => {
                        newRequest.onsuccess = () => resolve(newRequest.result)
                        newRequest.onerror = () => reject(newRequest.error)
                    })
                }
                
                console.log('Reply inserted and message updated successfully.')
            } catch (error) {
                console.error('Failed to insert message:', error)
                throw new Error('Failed to insert message or update chat: ' + error.message)
            }
        })
    }

    async deleteComment(parentMessageId, replyId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(parentMessageId)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingMessage) {
                    existingMessage.replies = existingMessage.replies.filter(reply => reply.id !== replyId)
                    const updateRequest = store.put(existingMessage)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve(updateRequest.result);
                        updateRequest.onerror = () => reject(updateRequest.error);
                    })
                }
                
                console.log('Reply deleted and message updated successfully.')
            } catch (error) {
                console.error('Failed to delete reply:', error)
                throw new Error('Failed to delete reply or update chat: ' + error.message)
            }
        })
    }

    async getThread(messageId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(messageId)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingMessage) {
                    return existingMessage
                }
                return null
            } catch (error) {
                console.error('Failed to insert messag:', error)
                return null
            }
        })
    }

    async updateMessage(id, data) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(id)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingMessage) {
                    const newMessage = { ...existingMessage, ...data }
                    const updateRequest = store.put(newMessage)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })

                    console.log(`Message with id ${id} was successfully updated.`)
                } else {
                    console.log(`Message with id ${id} not found.`)
                }
            } catch (error) {
                console.log('Failed to update message: ' + error.message)
            }
        })
    }

    async deleteMessage(id) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.delete(id)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve()
                    request.onerror = () => reject(request.error)
                })
                console.log(`Message with id ${id} was successfully deleted.`)
            } catch (error) {
                throw new Error('Failed to delete message: ' + error.message)
            }
        })
    }

    async updateMessagesForPinned(id) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(id)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingMessage) {
                    existingMessage.pinned = true
                    const updateRequest = store.put(existingMessage)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })

                    console.log(`Message with id ${id} was successfully updated to pinned.`)
                } else {
                    throw new Error(`Message with id ${id} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message as pinned: ' + error.message)
            }
        })
    }

    async updateMessagesForUnPinned(id) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(id)
                const existingMessage = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingMessage) {
                    existingMessage.pinned = false
                    const updateRequest = store.put(existingMessage)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`Message with id ${id} was successfully updated to unpinned.`)
                } else {
                    throw new Error(`Message with id ${id} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message as unpinned: ' + error.message)
            }
        })
    }
}
