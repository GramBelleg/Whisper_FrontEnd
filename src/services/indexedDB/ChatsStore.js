import BaseStore from "./BaseStore";
import { DB_CONFIG } from "./DBConfig";


// Chats Store class
class ChatsStore extends BaseStore {
    constructor(db) {
        super(db, DB_CONFIG.stores.chats.name);
    }

  
}


export default ChatsStore;