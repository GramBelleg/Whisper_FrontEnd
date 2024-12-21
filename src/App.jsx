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
import { getUsers, getGroups } from './services/adminservice/getData'
import { useWhisperDB } from './contexts/WhisperDBContext'
import { getMessagesForChatCleaned, getPinnedMessagesForChat } from './services/chatservice/getMessagesForChat'
import { getUsersWithStoriesCleaned } from './services/storiesservice/getStories'
import AdminPage from './pages/AdminPage'

function App() {
    const { user, token, handleUpdateUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const { dbRef, initDB } = useWhisperDB()

    if (import.meta.env.VITE_APP_USE_MOCKS === 'true') {
        initializeMock()
    }

    useEffect(() => {
        const init = async () => {
            await initDB()
            if(user.role !== 'Admin')
            {   
                await loadChats()
                await loadMessages()
                await loadPinnedMessages()
                await loadStories()
            }
            else
            {
                await loadUsers()
                await loadGroups()
            }
           
        }

        const loadUsers = async () => {
            try {
                let data = await getUsers()
                if (data && data.length > 0) {
                    console.log("data",data)
                    await dbRef.current.insertUsersAdminStore(data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const loadGroups = async () => {
            try {
                let data = await getGroups()
                if (data && data.length > 0) {
                    await dbRef.current.insertGroups(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        const loadChats = async () => {
            let allChats = await getChatsCleaned()
            await dbRef.current.insertChats(allChats)
        }

        const loadMessages = async () => {
            try {
                const chats = await dbRef.current.getChats()
                for (let chat of chats) {
                    try {
                        let messages = await getMessagesForChatCleaned(chat.id)
                        if (messages.length > 0) {
                            await dbRef.current.insertMessages(messages)
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
            init()
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, [5000]);
        }
    }, [dbRef, initDB])

    return (
        <div className='App'>
            <Router>
                <Routes>
                    {user ? (
                        console.log("user",user),
                        token && token !== 'undefined' ? (
                            user.role !== 'Admin' ? (
                                <>
                                    {!loading ? <Route path='/' element={<SampleHome />} /> : <Route path='/' element={<LoadingData />} />}
                                    <Route path='/*' element={<Navigate to='/' />} />
                                </>
                            ) : (
                                <>
                                    <Route path='/dashboard' element={ <AdminPage />} />
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
