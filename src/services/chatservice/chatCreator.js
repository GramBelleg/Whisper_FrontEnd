import { generateKeyPair } from "../encryption/keyManager";

export const generateKeyIfNotExists = async (chat, keysStore) => {
    let getAllmyKeys = await keysStore.getAll();
    let keyIds = getAllmyKeys.map(keyData => keyData.id);
    if(chat.participantKeys.some(key => keyIds.includes(key))) {
        return null;
    }
    let {privateKey, publicKey} = await generateKeyPair();
    return {privateKey, publicKey};
}