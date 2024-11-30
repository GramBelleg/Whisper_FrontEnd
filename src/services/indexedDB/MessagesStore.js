import BaseStore from "./BaseStore";
import { DB_CONFIG } from "./DBConfig";


class MessagesStore extends BaseStore {
    constructor(db) {
        super(db, DB_CONFIG.stores.messages.name);
    }

    
}


export default MessagesStore;