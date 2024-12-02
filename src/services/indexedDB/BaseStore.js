export class BaseStore {
    constructor(db, storeName) {
        this._db = db;
        this._storeName = storeName;
    }

    async _executeTransaction(mode, operation) {
        if (!this._db) {
            throw new Error("Database is not initialized");
        }

        try {
            const tx = this._db.transaction(this._storeName, mode);
            const store = tx.objectStore(this._storeName);
            return await operation(store);
        } catch (error) {
            console.error(`Error in ${this._storeName} store:`, error);
            throw error;
        }
    }
}