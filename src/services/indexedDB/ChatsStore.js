import { BaseStore } from './BaseStore'


export class ChatsStore extends BaseStore {
    constructor(db) {
        super(db, 'chats')
    }

    async insertChats(chats) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                chats.forEach(async (chat) => {
                    const request = store.put(chat)
                    await new Promise((resolve, reject) => {
                        request.onsuccess = () => resolve()
                        request.onerror = () => reject(request.error)
                    })
                })
            } catch (error) {
                console.error('Error inserting chats:', error)
            }
        })
    }

    async insertChat(chat) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.put(chat)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve()
                    request.onerror = () => reject(request.error)
                })
            } catch (error) {
                console.error('Error inserting chats:', error)
            }
        })
    }

    async insertMessageInChat(message) {
        const user = localStorage.getItem("user")
        return this._executeTransaction('readwrite', async (store) => {
            const chatRequest = store.get(message.chatId)
            const chat = await new Promise((resolve, reject) => {
                chatRequest.onsuccess = () => resolve(chatRequest.result)
                chatRequest.onerror = () => reject(chatRequest.error)
            })
            if (chat) {
                if (message.senderId === user.id || (chat.drafted === false && message.senderId !== user.id)) {
                    chat.lastMessageId = message.id
                    chat.lastMessage = message.content
                    chat.messageTime = message.time
                    chat.senderId = message.senderId
                    chat.sender = message.sender
                    chat.messageType = message.type
                    chat.messageState = message.state
                    chat.media = message.media ? message.media : null
                    chat.drafted = false
                    chat.attachmentName = message.attachmentName ? message.attachmentName : null
                    chat.attachmentType = message.attachmentType ? message.attachmentType : null
                    chat.size = message.size ? message.size : null
                    chat.objectLink = message.objectLink ? message.objectLink : null
                    chat.extension = message.extension ? message.extension : null

                    const updateRequest = store.put(chat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                }
            } else {
                throw new Error(`Chat with id ${message.chatId} not found`)
            }
        })
    }

    async insertDraftedMessage(chatId, draftedMessage) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const chatRequest = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    chatRequest.onsuccess = () => resolve(chatRequest.result)
                    chatRequest.onerror = () => reject(chatRequest.error)
                })
                if (chat) {
                    chat.lastMessageId = null
                    chat.lastMessage = draftedMessage.draftContent
                    chat.messageTime = draftedMessage.draftTime
                    chat.senderId = null
                    chat.sender = null
                    chat.messageType = null
                    chat.messageState = null
                    chat.media = null
                    chat.drafted = true
                    const updateRequest = store.put(chat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                } else {
                    throw new Error(`Chat with id ${message.chatId} not found`)
                }
            } catch (error) {}
        })
    }

    async updateLastMessage(chatId, data) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const chatRequest = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    chatRequest.onsuccess = () => resolve(chatRequest.result)
                    chatRequest.onerror = () => reject(chatRequest.error)
                })
                if (chat) {
                    const newChat = {
                        ...chat,
                        messageState: data.state
                    }
                    const updateRequest = store.put(newChat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                } else {
                    throw new Error(`Chat with id ${chatId} not found`)
                }
            } catch (error) {}
        })
    }

    async getChats() {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.getAll()
                const chats = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) // Reject on error
                })
                return chats
            } catch (error) {
                throw new Error('Failed to get chats from indexed db: ' + error.message)
            }
        })
    }

    async getChatMembers(chatId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) 
                })
                if (chat) 
                    return chat.members
                else 
                    return []
            } catch (error) {
                throw new Error('Failed to get chats from indexed db: ' + error.message)
            }
        })
    }

    async removeChat(chatId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.delete(chatId)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) 
                })
            } catch (error) {
                throw new Error('Failed to get chats from indexed db: ' + error.message)
            }
        })
    }

    async removeChatMember(chatId, memberId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) 
                })
                if (chat) {
                    chat.members = chat.members.filter(member => member.id !== memberId)
                    const updateRequest = store.put(chat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve(updateRequest.result)
                        updateRequest.onerror = () => reject(updateRequest.error) 
                    })
                }
            } catch (error) {
                throw new Error('Failed to get chats from indexed db: ' + error.message)
            }
        })
    }

    async getDraftedMessage(chatId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (chat && chat.drafted) return chat.lastMessage
                else return null
            } catch (error) {
                throw new Error('Failed to get message from indexed db: ' + error.message)
            }
        })
    }

    async updateUnreadCount(chatId, increment = true) {
        return this._executeTransaction('readwrite', async (store) => {
            const request = store.get(chatId)
            const chat = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result)
                request.onerror = () => reject(request.error)
            })

            if (chat) {
                chat.unreadMessageCount = increment ? (chat.unreadMessageCount || 0) + 1 : 0

                const updateRequest = store.put(chat)
                return new Promise((resolve, reject) => {
                    updateRequest.onsuccess = () => resolve(chat)
                    updateRequest.onerror = () => reject(updateRequest.error)
                })
            }
        })
    }

    async unDraftMessage(chatId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(chatId)
                const chat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (chat) {
                    chat.drafted = false
                    chat.lastMessage = ''
                    const updateRequest = store.put(chat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })

                    console.log(`chat with id ${chatId} was successfully updated to undrafted.`)
                } else {
                    throw new Error(`Message with id ${chatId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message as muted: ' + error.message)
            }
        })
    }

    async muteNotifications(chatId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(chatId)
                const existingChat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingChat) {
                    existingChat.isMuted = true
                    const updateRequest = store.put(existingChat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`chat with id ${chatId} was successfully updated to muted.`)
                } else {
                    throw new Error(`Chat with id ${chatId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message as muted: ' + error.message)
            }
        })
    }

    async unMuteNotifications(chatId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(chatId)
                const existingChat = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingChat) {
                    existingChat.isMuted = false
                    const updateRequest = store.put(existingChat)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`chat with id ${chatId} was successfully updated to unmuted.`)
                } else {
                    throw new Error(`Chat with id ${chatId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update message as unmuted: ' + error.message)
            }
        })
    }
}
