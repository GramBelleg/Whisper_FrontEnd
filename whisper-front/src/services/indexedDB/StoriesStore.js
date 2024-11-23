import BaseStore from "./BaseStore";
import { DB_CONFIG } from "./DBConfig";

// Stories Store class
class StoriesStore extends BaseStore {
    constructor(db) {
        super(db, DB_CONFIG.stores.stories.name);
    }
    
    
}

export default StoriesStore;