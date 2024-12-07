import { BaseStore }  from "./BaseStore";
import { DB_CONFIG } from "./DBConfig";


export class KeysStore extends BaseStore {
    constructor(db) {
        super(db, DB_CONFIG.stores.keys.name);
    }

    async storeKey(id,key) {
        return this._executeTransaction('readwrite', async (store) => {
            try {
                store.add({
                    id,
                    key
                })
                console.log('Keys inserted successfully!')
            } catch (error) {
                console.error('Error inserting keys:', error)
            }
        })
    }

    async getKey(id) {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.get(id)
                const key = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                return key
            } catch (error) {
                throw new Error('Failed to get keys from indexed db: ' + error.message)
            }
        })
    }

    async getAll() {
        return this._executeTransaction('readonly', async (store) => {
            try {
                const request = store.getAll()
                const keys = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result)
                    request.onerror = () => reject(request.error)
                })
                return keys
            } catch (error) {
                throw new Error('Failed to get keys from indexed db: ' + error.message)
            }
        })
    }

    async hasKey(id) {
        try {
            const key = await this.getKey(id);
            return key ? true : false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }   
}