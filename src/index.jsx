import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import './styles/colors.css'
import React from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ProfileSettingsProvider } from './contexts/ProfileSettingsContext.jsx'
import { WhisperDBProvider } from './contexts/WhisperDBContext.jsx'
import { StoriesProvider } from './contexts/StoryContext.jsx'
import { ChatProvider } from './contexts/ChatContext.jsx'
import { SidebarProvider } from './contexts/SidebarContext.jsx'

createRoot(document.getElementById('root')).render(
    <ProfileSettingsProvider>
        <AuthProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
                <WhisperDBProvider>
                    <StoriesProvider>
                        <SidebarProvider>
                            <ChatProvider>
                                <App />
                            </ChatProvider>
                        </SidebarProvider>
                    </StoriesProvider>
                </WhisperDBProvider>
            </GoogleOAuthProvider>
        </AuthProvider>
    </ProfileSettingsProvider>
)
