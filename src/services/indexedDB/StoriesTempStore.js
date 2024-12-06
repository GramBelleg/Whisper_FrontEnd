import { BaseStore } from './BaseStore'


export class StoriesTempStore extends BaseStore {
    constructor(db) {
        super(db, 'stories_temp')
    }

    async insertStories(stories) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                stories.forEach((story) => {
                    store.add(story)
                })

                console.log('stories inserted successfully!')
            } catch (error) {
                console.error('Error inserting stories:', error)
            }
        })
    }

    async getStories() {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.getAll()
                const stories = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                return stories
            } catch (error) {
                console.error('Error getting stories:', error)
            }
        })
    }

    async deleteUserFromStories(userId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.delete(userId)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
            } catch (error) {
                console.error('Error getting stories:', error)
            }
        })
    }

    async userHasStories(userId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(userId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (story) {
                    return true
                }

                return false
            } catch (error) {
                return false
            }
        })
    }

    async postUserStories(storyData, userData) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const newStory = {
                    userId: storyData.userId,
                    userName: userData.userName, // TODO
                    profilePic: userData.profilePic
                }
                const request = store.add(newStory)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
            } catch (error) {
                console.log(error)
            }
        })
    }
}
