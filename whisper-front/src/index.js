import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {AuthProvider} from './contexts/AuthContext';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
if(process.env.USE_MOCKS==='true'){
  console.log(process.env.NODE_ENV);
  //initialize axios mock
  console.log("initializing mock");
  const {initializeMock} = require('./mocks/mock');
  initializeMock();
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>

    <App />
    </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);

