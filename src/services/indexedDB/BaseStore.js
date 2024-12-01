// Base Store class that other stores will extend
class BaseStore {
    constructor(db, storeName) {
        this.db = db;
        this.storeName = storeName;
    }

    async add(item) {
        return this.runTransaction('readwrite', store => store.add(item));
    }

    async get(id) {
        return this.runTransaction('readonly', store => store.get(id));
    }

    async update(item) {
        return this.runTransaction('readwrite', store => store.put(item));
    }

    async delete(id) {
        return this.runTransaction('readwrite', store => store.delete(id));
    }

    async getAll() {
        return this.runTransaction('readonly', store => store.getAll());
    }

    async getAllByIndex(indexName, value) {
        return this.runTransaction('readonly', store => {
            const index = store.index(indexName);
            return index.getAll(value);
        });
    }

    async runTransaction(mode, callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, mode);
            const store = transaction.objectStore(this.storeName);
            
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}


export default BaseStore;