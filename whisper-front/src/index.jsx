import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import './styles/colors.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {AuthProvider} from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
        </AuthProvider>
    </StrictMode>
)
