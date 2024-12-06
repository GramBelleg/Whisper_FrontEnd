import { BaseStore } from './BaseStore'


export class StoriesStore extends BaseStore {
    constructor(db) {
        super(db, 'stories')
    }

    async getUserStories(userId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const index = store.index('userId')
                const request = index.getAll(userId)
                const stories = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (stories) {
                    return stories
                } else {
                    throw new Error('User stories not found')
                }
            } catch (error) {
                throw error
            }
        })
    }

    async insertUserStories(stories, userId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                if (stories) {
                    stories.forEach((story) => {
                        store.add({
                            ...story,
                            userId: userId
                        })
                    })
                }
                console.log('stories inserted successfully!')
            } catch (error) {
                console.error('Error inserting stories:', error)
            }
        })
    }

    async getStory(id) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(id)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                return story
            } catch (error) {
                throw new Error('Failed to get stories from indexed db: ' + error.message)
            }
        })
    }

    async storyExists(id) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(id)
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

    async postStory(story) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.add(story)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
            } catch (error) {
                throw new Error('Failed to post story into indexed db: ' + error.message)
            }
        })
    }

    async addStoryBlob(storyId, blob) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                let story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (story) {
                    story.blob = blob
                    const request2 = store.put(story)
                    await new Promise((resolve, reject) => {
                        request2.onsuccess = () => resolve(request2.result)
                        request2.onerror = () => reject(request2.error)
                    })
                }
            } catch (error) {
                throw new Error('Failed to post story into indexed db: ' + error.message)
            }
        })
    }

    async deleteStory(storyId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.delete(storyId)
                await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
            } catch (error) {
                throw new Error('Failed to post story into indexed db: ' + error.message)
            }
        })
    }

    async likesLoaded(storyId) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (story && story.likes != null) {
                    return true
                }
                return false
            } catch (error) {
                return false
            }
        })
    }

    async iLiked(storyId, liked) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (story) {
                    story.liked = liked
                    const request2 = store.put(story)
                    await new Promise((resolve, reject) => {
                        request2.onsuccess = () => resolve(request2.result)
                        request2.onerror = () => reject(request2.error)
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })
    }

    async iViewed(storyId, viewed) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (story) {
                    story.viewed = viewed
                    const request2 = store.put(story)
                    await new Promise((resolve, reject) => {
                        request2.onsuccess = () => resolve(request2.result)
                        request2.onerror = () => reject(request2.error)
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })
    }

    async isViewed(storyId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (story) {
                    return story.viewed
                }
                return false
            } catch (error) {
                throw error
            }
        })
    }

    async isLiked(storyId) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (story) {
                    return story.liked
                }
                return false
            } catch (error) {
                throw error
            }
        })
    }

    async loadLikes(storyId, likes, increment = false) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                if (story) {
                    if (increment) {
                        story.likes++
                    } else {
                        story.likes = likes
                    }
                }
                const request2 = store.put(story)
                await new Promise((resolve, reject) => {
                    request2.onsuccess = () => resolve(request2.result)
                    request2.onerror = () => reject(request2.error)
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    async loadViews(storyId, views, increment = false) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const request = store.get(storyId)
                const story = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })

                if (story) {
                    if (increment) {
                        story.views++
                    } else {
                        story.views = views
                    }
                }
                const request2 = store.put(story)
                await new Promise((resolve, reject) => {
                    request2.onsuccess = () => resolve(request2.result)
                    request2.onerror = () => reject(request2.error)
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    async addStoryAttributes(id, storyAttributes) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                const story = this.getStory(id)
                if (story && storyAttributes) {
                    story.media = {
                        media: storyAttributes.media,
                        content: storyAttributes.content,
                        date: storyAttributes.date
                    }
                    const updateRequest = store.put(story)
                    await new Promise((resolve, reject) => {
                        updateRequest.onsuccess = () => resolve()
                        updateRequest.onerror = () => reject(updateRequest.error)
                    })
                }
            } catch (error) {
                throw new Error('Failed to add story media into indexed db: ' + error.message)
            }
        })
    }
}
