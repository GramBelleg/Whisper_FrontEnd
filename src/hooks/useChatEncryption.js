import { useWhisperDB } from "@/contexts/WhisperDBContext";
import useAuth from "./useAuth";
import { generateKeyIfNotExists as keyGeneratorIfNotExists } from "@/services/chatservice/chatCreator";
import axiosInstance from "@/services/axiosInstance";
import { decryptMessage as decryptMessageUtil, encryptMessage as encryptMessageUtil, deriveSharedSecret, deriveSymmetricKeyWithHKDF, importPrivateKey, importPublicKey } from "@/services/encryption/keyManager";
import { useState } from "react";


const useChatEncryption = () => {
  const {user: authUser} = useAuth();
    const { dbRef } = useWhisperDB();
    const [chatKey, setChatKey] = useState(null);
    const [chatId, setChatId] = useState(null);

  const generateKeyIfNotExists = async (chat) => {
     let keys = await keyGeneratorIfNotExists(chat, dbRef.current.getKeysStore());
     if(keys) {
        try {
          let response = await axiosInstance.post('/api/encrypt',{
              key: keys.publicKey,
              userId: authUser.id
            })
            
          const keyId = response.data;
          await dbRef.current.getKeysStore().storeKey(keyId, keys.privateKey);
          return keyId;
          } catch (error) {
            return null;
          }
     }
     return null;
  }

  const getChatSymmetricKey = async (chat) => {
    try {
      if (chatId && chatId === chat.id && chatKey) {
          return chatKey;
      }
      const keyIds = chat.participantKeys;
      const key1Data = await dbRef.current.getKeysStore().getKey(keyIds[0] ?? 0);
      const key2Data = await dbRef.current.getKeysStore().getKey(keyIds[1] ?? 0);
      let myKeyBase64 = key1Data ? key1Data.key : key2Data.key;
      let othersKeyId = key1Data ? keyIds[1] : keyIds[0];

      if(!myKeyBase64 || !othersKeyId) {
          throw new Error('Other user key not found');
      }
      const { data: othersPublicKeyBase64 } = await axiosInstance.get(`/api/encrypt/${chat.id}?userId=${chat.othersId}`);
      if(!othersPublicKeyBase64) {
          throw new Error('Other user key not found');
      }

      let myKey = await importPrivateKey(myKeyBase64);
      let othersPublicKey = await importPublicKey(othersPublicKeyBase64);
      let sharedSecret = await deriveSharedSecret(myKey, othersPublicKey);
      const symmetricKey = await deriveSymmetricKeyWithHKDF(sharedSecret);
      console.log('Symmetric key', symmetricKey);
      console.log('chat key ids', chat.participantKeys);
      setChatKey(symmetricKey);
      setChatId(chat.id);
      return symmetricKey;
    } catch (error) {
      console.log(error)
    }
  }

  const encryptMessage = async (message, chat) => {
    const symmetricKey = await getChatSymmetricKey(chat);
    if(!symmetricKey) {
        console.error('Symmetric key not found must probably your device is not participant in the chat');
    }
    const encryptedMessage = await encryptMessageUtil(message, symmetricKey);
    return encryptedMessage;
  }


  const decryptMessage = async (message, chat) => {
    const symmetricKey = await getChatSymmetricKey(chat);
    if(!symmetricKey) {
      console.error('Symmetric key not found must probably your device is not participant in the chat');
    }
    const decryptedMessage = await decryptMessageUtil(message, symmetricKey);
    console.log('Decrypted message', decryptedMessage);
    return decryptedMessage;
  }




  return {
    generateKeyIfNotExists,
    encryptMessage,
    decryptMessage
  };
};

export default useChatEncryption;
