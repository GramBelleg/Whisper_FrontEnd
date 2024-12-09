import SampleHome from './components/SampleHome/SampleHome'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword'
import SignupPage from './pages/SignupPage'
import useAuth from './hooks/useAuth'
import EmailVerification from './pages/EmailVerification'
import GithubCallback from './pages/GithubCallback'
import FacebookCallback from './pages/FacebookCallback'
import { initializeMock } from './mocks/mock'
import { useEffect, useState } from 'react'
import LoadingData from './components/LoadingData/LoadingData'
import { getChatsCleaned } from './services/chatservice/getChats'
import { useWhisperDB } from './contexts/WhisperDBContext'
import { getMessagesForChatCleaned, getPinnedMessagesForChat } from './services/chatservice/getMessagesForChat'
import { getUsersWithStoriesCleaned } from './services/storiesservice/getStories'
import useChatEncryption from './hooks/useChatEncryption'
import axiosInstance from './services/axiosInstance'
import { useChat } from './contexts/ChatContext'
import { getAllUsers } from './services/userservices/getAllUsers'

function App() {
    const { user, token, handleUpdateUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const { dbRef } = useWhisperDB()
    const { user: authUser } = useAuth()
    const { sendJoinChat } = useChat();
    const {decryptMessage, generateKeyIfNotExists} = useChatEncryption();

    if (import.meta.env.VITE_APP_USE_MOCKS === 'true') {
        initializeMock()
    }

    useEffect(() => {
        const init = async () => { 
            try {
                await loadChats()
                await loadMessages()
                await loadPinnedMessages()
                await loadStories()
                await loadUsers()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        const loadUsers = async () => {
            try {
                let allUsers = await getAllUsers()
                if (allUsers) {
                    await dbRef.current.insertUsers(allUsers)
                }
            } catch (error) {
                console.error(error)
            }

        }

        const loadChats = async () => {
            try {
                let allChats = await getChatsCleaned()
                let myDeviceChats = [];
                const getAllmyKeys = await dbRef.current.getKeysStore().getAll();
                const keyIds = getAllmyKeys.map(keyData => keyData.id);
                
                for (const chat of allChats) {
                    if (chat.type === 'DM' && chat.participantKeys.some(key => keyIds.includes(key))) {
                        myDeviceChats.push(chat);
                    } else if (chat.type === 'DM' && (!chat.participantKeys[1] || !chat.participantKeys[0])) {
                        // I am the second participant in the chat and I have to generate the key
                        let joinedChat = { ...chat };
                        // this will send key to the server and store its' private part in the indexedDB
                        let keyId = await generateKeyIfNotExists(chat, dbRef.current.getKeysStore());
                        if (keyId) {
                            if(!joinedChat.participantKeys[1]) {
                                joinedChat.participantKeys[1] = keyId;
                            }
                            if(!joinedChat.participantKeys[0]) {
                                joinedChat.participantKeys[0] = keyId;
                            }
                            // associate my key with the chat
                            await axiosInstance.put(`/api/encrypt/${joinedChat.id}?keyId=${keyId}`, {
                                keyId: keyId,
                                userId: authUser.id
                            });
                            sendJoinChat(joinedChat, keyId);
                        }
                        myDeviceChats.push(joinedChat);
                    } else if (chat.type != 'DM') {
                        myDeviceChats.push(chat);
                    }
                    console.log(myDeviceChats)
                }
                await dbRef.current.insertChats(myDeviceChats)
            } catch (error) {
                console.log(error)
            }
        }

        const loadMessages = async () => {
            try {
                const chats = await dbRef.current.getChats()
                for (let chat of chats) {
                    try {
                        let messages = await getMessagesForChatCleaned(chat.id)
                        if (messages.length > 0) {
                            let decryptedMessages = messages;
                            if(chat.type == 'DM' && chat.participantKeys) {
                                decryptedMessages = await Promise.all(
                                    messages.map(async (message) => {
                                        
                                        const decryptedMessage = { ...message };
                                        try {
                                        decryptedMessage.content = await decryptMessage(message.content, chat);
                                        if (message.parentMessage && message.parentMessage.content) {
                                            const parentMessage = { ...message.parentMessage };
                                            parentMessage.content = await decryptMessage(message.parentMessage.content, chat);
                                            decryptedMessage.parentMessage = parentMessage;
                                        }
                                        } catch (error) {}

                                        return decryptedMessage;
                                    })
                                );
                            }
                            await dbRef.current.insertMessages(decryptedMessages)
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        const loadStories = async () => {
            try {
                let iHaveStoryFlag = false
                let data = await getUsersWithStoriesCleaned(iHaveStoryFlag)
                if (data && data.length > 0) {
                    data = data.map((item) => {
                        const { id, ...rest } = item
                        return { userId: id, ...rest }
                    })
                    await dbRef.current.insertStories(data)
                    handleUpdateUser('hasStory', iHaveStoryFlag)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const loadPinnedMessages = async () => {
            try {
                const chats = await dbRef.current.getChats()
                for (let chat of chats) {
                    try {
                        let messages = await getPinnedMessagesForChat(chat.id)
                        if (messages.length > 0) {
                            dbRef.current.insertPinnedMessages(chat.id, messages)
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        try {
            setLoading(true)
            init()
            console.log("Helo")
        } catch (error) {
            console.error(error)
        }
    }, [dbRef])

    return (
        <div className='App'>
            <Router>
                <Routes>
                    {user ? (
                        token && token !== 'undefined' ? (
                            user.role !== 'admin' ? (
                                <>
                                    {!loading ? <Route path='/' element={<SampleHome />} /> : <Route path='/' element={<LoadingData />} />}
                                    <Route path='/*' element={<Navigate to='/' />} />
                                </>
                            ) : (
                                <>
                                    <Route path='/dashboard' element={<div>Dashboard</div>} />
                                    <Route path='/' element={<Navigate to='/dashboard' />} />
                                    <Route path='/*' element={<Navigate to='/dashboard' />} />
                                </>
                            )
                        ) : (
                            <>
                                <Route path='/email-verification' element={<EmailVerification />} />
                                <Route path='/*' element={<Navigate to='/email-verification' />} />
                            </>
                        )
                    ) : (
                        <>
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/signup' element={<SignupPage />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />
                            <Route path='/*' element={<Navigate to='/signup' />} />
                        </>
                    )}
                    <Route path='/github-callback' element={<GithubCallback />} />
                    <Route path='/facebook-callback' element={<FacebookCallback />} />
                </Routes>
            </Router>
        </div>
    )
}
export default App
