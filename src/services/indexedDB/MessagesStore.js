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
                    console.log(response)
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

    async insertMessage(message) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
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
                    throw new Error(`Message with id ${id} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message: ' + error.message)
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
