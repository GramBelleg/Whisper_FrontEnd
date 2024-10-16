import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {AuthProvider} from './contexts/AuthContext';
import App from './App';
if(process.env.NODE_ENV === 'development'){
  //initialize axios mock
  const {initializeMock} = require('./mocks/mock');
  initializeMock();
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>
);

