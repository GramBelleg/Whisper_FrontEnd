import { BaseStore } from './BaseStore'


export class UsersStore extends BaseStore {
    constructor(db) {
        super(db, 'users')
    }

    async insertUsers(users) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                users.forEach(async (user) => {
                    const request = store.put(user)
                    await new Promise((resolve, reject) => {
                        request.onsuccess = () => resolve()
                        request.onerror = () => reject(request.error)
                    })
                })
            } catch (error) {
                console.error('Error inserting users:', error)
            }
        })
    }

    async getUsers() {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.getAll()
                const users = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) 
                })
                return users
            } catch (error) {
                throw new Error('Failed to get chats from indexed db: ' + error.message)
            }
        })
    }
}
