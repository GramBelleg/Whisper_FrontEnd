import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import './styles/colors.css'
import './index.css';
import React from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ProfileSettingsProvider } from './contexts/ProfileSettingsContext.jsx'
import { WhisperDBProvider } from './contexts/WhisperDBContext.jsx'
import { StoriesProvider } from './contexts/StoryContext.jsx'
import { ChatProvider } from './contexts/ChatContext.jsx'
import { SidebarProvider } from './contexts/SidebarContext.jsx'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react';
AgoraRTC.setLogLevel(3)
const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

createRoot(document.getElementById('root')).render(
    <WhisperDBProvider>
        <AuthProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
                <ProfileSettingsProvider>
                    <StoriesProvider>
                        <SidebarProvider>
                            <ChatProvider>
                                <AgoraRTCProvider client={agoraClient}>
                                    <App />
                                </AgoraRTCProvider>
                            </ChatProvider>
                        </SidebarProvider>
                    </StoriesProvider>
                </ProfileSettingsProvider>
            </GoogleOAuthProvider>
        </AuthProvider>
    </WhisperDBProvider>
)
