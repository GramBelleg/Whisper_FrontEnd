import SampleHome from './components/SampleHome/SampleHome';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import SignupPage from "./pages/SignupPage";
import useAuth from "./hooks/useAuth";
import EmailVerification from "./pages/EmailVerification";
import GithubCallback from "./pages/GithubCallback";
import FacebookCallback from "./pages/FacebookCallback";
import { initializeMock } from './mocks/mock';
import { useEffect, useState } from 'react';
import LoadingData from './components/LoadingData/LoadingData';
import { getChatsCleaned } from './services/chatservice/getChats';
import { useWhisperDB } from './contexts/WhisperDBContext';
import { getMessagesForChatCleaned, getPinnedMessagesForChat } from './services/chatservice/getMessagesForChat';


function App() {

    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const { dbRef , initDB } = useWhisperDB();

    if(import.meta.env.VITE_APP_USE_MOCKS === 'true') {
        initializeMock();
    }

    
  
    
      
    useEffect(() => {

        const init = async () => {
            await initDB();
            await loadChats();
            loadMessages();
            loadPinnedMessages();
        }

       
        
        const loadChats = async () => {
            let allChats = await getChatsCleaned();
            dbRef.current.insertChats(allChats);
            console.log(allChats)
        }
    
        const loadMessages = async () => {
            try {
                const chats = await dbRef.current.getChats()
                for (let chat of chats) {
                    try {
                        let messages = await getMessagesForChatCleaned(chat.id);
                        if (messages.length > 0) {
                            dbRef.current.insertMessages(messages);
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
          }
    
        const loadPinnedMessages = async () => {
            try {
                const chats = await dbRef.current.getChats();
                for (let chat of chats) {
                    try {
                        let messages = await getPinnedMessagesForChat(chat.id);
                        if (messages.length > 0) {
                            dbRef.current.insertPinnedMessages(chat.id, messages);
                        }
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        try { 
            init();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    },[dbRef, initDB]);

    return (
        <div className="App">
            <Router>
                <Routes>
                {user ? (
                    token && token !== 'undefined' ? (
                        user.role !== "admin" ? (
                        <>
                            {
                                !loading ? (
                                    <Route
                                        path="/"
                                        element={<SampleHome/>}
                                    />
                                ) : (
                                    <Route
                                    path="/"
                                    element={<LoadingData/>}
                                    />
                                )
                            }
                            <Route path="/*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/dashboard" element={<div>Dashboard</div>} />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/*" element={<Navigate to="/dashboard" />} />
                        </>
                    )
                    ) : (
                    <>
                        <Route
                            path="/email-verification"
                            element={<EmailVerification />}
                            />
                        <Route
                            path="/*"
                            element={<Navigate to="/email-verification" />}
                        />
                    </>
                )
                ) : (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/*" element={<Navigate to="/signup" />} />
                </>
                )}
                <Route path="/github-callback" element={<GithubCallback />} />
                <Route path="/facebook-callback" element={<FacebookCallback />} />
            </Routes>
        </Router>
        </div>
    );
}
export default App  ;