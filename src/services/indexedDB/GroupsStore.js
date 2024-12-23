import { BaseStore } from './BaseStore'


export class GroupsStore extends BaseStore {
    constructor(db) {
        super(db, 'groups')
    }

    async insertGroups(groups) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                groups.forEach((group) => store.add(group))
                console.log('groups inserted successfully!')
            } catch (error) {
                console.error('Error inserting groups:', error)
            }
        })
    }


    async getGroups() {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.getAll()
                const groups = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error) // Reject on error
                })
                return groups
            } catch (error) {
                throw new Error('Failed to get groups from indexed db: ' + error.message)
            }
        })
    }



    async filterGroup(groupId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(groupId)
                const existingGroup = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingGroup) {
                    existingGroup.filter = true
                    const updateRequest = store.put(existingGroup)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`Group with id ${groupId} was successfully filtered.`)
                } else {
                    throw new Error(`Group with id ${groupId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update group as banned: ' + error.message)
            }
        })
    }

    async unFilterGroup(groupId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(groupId)
                const existingGroup = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (existingGroup) {
                    existingGroup.filter = false
                    const updateRequest = store.put(existingGroup)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                    console.log(`Group with id ${groupId} was successfully updated to unfiltered.`)
                } else {
                    throw new Error(`Group with id ${groupId} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update group as unfiltered: ' + error.message)
            }
        })
    }
    async updateGroup(id, data) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(id)
                const existingGroup = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (existingGroup) {
                    const newGroup = { ...existingGroup, ...data }
                    const updateRequest = store.put(newGroup)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })

                    console.log(`Group with id ${id} was successfully updated.`)
                } else {
                    throw new Error(`Group with id ${id} not found.`)
                }
            } catch (error) {
                throw new Error('Failed to update group: ' + error.message)
            }
        })
    }
}
