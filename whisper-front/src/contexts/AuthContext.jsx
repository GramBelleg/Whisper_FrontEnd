import { useState, useEffect, createContext } from 'react';
import {
  signUp,
  login,
  forgotPassword,
  verify,
  setAuthData
} from '../services/authService';
import { loadAuthData } from '../services/tokenService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      
  const [token, setToken] = useState(null);    
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);    

  useEffect(() => {

    const { token: storedToken, user: storedUser } = loadAuthData();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser); 
    }
  }, []);

  const handleSignUp = async (userData) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await signUp(userData);    
      setUser(data);                          
      setAuthData(data, data.token);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await verify(code);    
      setToken(data.token);
      setUser(data);                          
      setAuthData(data, data.token);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await login(credentials);  
      setToken(data.token);
      setUser(data);                          
      setAuthData(data, data.token);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError(null); 
    try {
      await forgotPassword(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      handleSignUp,
      handleLogin,
      handleForgotPassword,
      handleVerify,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
