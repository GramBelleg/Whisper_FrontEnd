import { BaseStore } from './BaseStore'


export class UsersAdminStore extends BaseStore {
    constructor(db) {
        super(db, 'usersadmin')
    }

    async insertUsers(users) {
        console.log("users here are", users)
        return this._executeTransaction('readwrite', async (store) => {
            try {
                users.forEach((user) => store.add(user))
                console.log('users inserted successfully!')
            } catch (error) {
                console.error('Error inserting groups:', error)
            }
        })
    }


    async getUsers() {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.getAll()
                const users = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) // Reject on error
                })
                return users
            } catch (error) {
                throw new Error('Failed to get users from indexed db: ' + error.message)
            }
        })
    }



    async banUser(userId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(userId)
                const existingUser = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingUser) {
                    existingUser.banned = true
                    const updateRequest = store.put(existingUser)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`User with id ${userId} was successfully banned.`)
                } else {
                    throw new Error(`User with id ${userId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update user as banned: ' + error.message)
            }
        })
    }

    async unBanUser(userId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(userId)
                const existingUser = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingUser) {
                    existingUser.banned = false
                    const updateRequest = store.put(existingUser)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`User with id ${userId} was successfully updated to unbanned.`)
                } else {
                    throw new Error(`User with id ${userId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update user as unbanned: ' + error.message)
            }
        })
    }
    async updateUser(id, data) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(id)
                const existingUser = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingUser) {
                    const newUser = { ...existingUser, ...data }
                    const updateRequest = store.put(newUser)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })

                    console.log(`User with id ${id} was successfully updated.`)
                } else {
                    throw new Error(`User with id ${id} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update user: ' + error.message)
            }
        })
    }
}
