import ChatList from '../ChatList/ChatList'
import './ChatPage.css'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SearchBar from '../SearchBar/SearchBar'
import { useState, useEffect, useCallback } from 'react'
import AddNewButton from '../AddNewButton/AddNewButton'
import { useChat } from '@/contexts/ChatContext'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import { useModal } from '@/contexts/ModalContext'

import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import ChatSocket from '@/services/sockets/ChatSocket'
import useChatEncryption from '@/hooks/useChatEncryption'
import useAuth from '@/hooks/useAuth'
import CreatePrivateChatModal from '../Modals/CreatePrivateChatModal/CreatePrivateChatModal'
import axiosInstance from '@/services/axiosInstance'

const ChatPage = () => {
    const { selectChat, action, messageDelivered, sendJoinChat } = useChat()
    const [chatList, setChatList] = useState([])
    const { dbRef } = useWhisperDB()
    const chatSocket = new ChatSocket()
    const { openModal, closeModal } = useModal()

    const {user:authUser} = useAuth();

    

    const handleAddNewClick = () => {
        openModal(
            <CreatePrivateChatModal />
        )
    };

    const {generateKeyIfNotExists} = useChatEncryption();

    const handleChatCreate = useCallback(async (chatData) => {
        try {
            let data = { ...chatData };
            let keyId = await generateKeyIfNotExists(chatData);
            if (keyId) {
                // then I am the second participant in the chat
                data.participantKeys[1] = keyId;
                await axiosInstance.put(`/api/encrypt/${chatData.id}?keyId=${keyId}`, {
                    keyId: keyId,
                    userId: authUser.id
                });
                sendJoinChat(chatData, keyId);
            }
            // otherwise I am the first participant in the chat how created the chat and I have the key already
            await dbRef.current.insertChats([data]);
    
            setChatList((prev) => [...prev, data]);
            
        } catch (error) {
            console.error(error);
        }
    }, []);

    const loadChats = async () => {
        try {
            let allChats = await dbRef.current.getChats()
            setChatList(allChats)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} appearFor={3000} onClose={closeModal} />)
        }
    }

    useEffect(() => {
        loadChats()

    }, []);

    useEffect(() => {
        console.log('subscribing from chat create')
        chatSocket.onReceiveCreateChat(handleChatCreate);
        return () => {
            console.log('unsubscribing from chat create')
            chatSocket.offReceiveCreateChat(handleChatCreate);
        };
    }, [handleChatCreate]);

    useEffect(() => {
        if (action || messageDelivered) {
            loadChats()
        }
    }, [action, messageDelivered, loadChats])

    return (
        <div className='chat-page'>
            <div>
                <SearchBar />
            </div>
            <div className='sidebar__stories'>
                <StoriesContainer />
            </div>
            <div className='sidebar__other-content overflow-y-auto h-full'>
                {chatList && chatList.length > 0 && <ChatList chatList={chatList} chooseChat={selectChat} />}
                <AddNewButton onClick={handleAddNewClick} />
            </div>
        </div>
    )
}

export default ChatPage
