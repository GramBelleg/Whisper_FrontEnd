import { useState, useEffect, createContext } from 'react';
import {
  signUp,
  login,
  forgotPassword,
  verify,
  resetPassword,
  setAuthData,
  googleSignUp,
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
    console.log(userData,"handle sign up")
    setLoading(true);
    setError(null); 
    try {
      console.log("signUp will get called")
      const data = await signUp(userData);    
      setUser(data);                          
      setAuthData(data, data.token);  
    } catch (err) {
      console.log("error in auth",err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (userData) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await googleSignUp(userData);  
      setUser(data.user);      
      setToken(data.userToken);                    
      setAuthData(data.user, data.userToken);  
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
  const handleReset=async (userData)=>{
    setLoading(true);
    setError(null);
    try{
      const data=await resetPassword(userData);
      console.log(data);
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }

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
      handleGoogleSignUp,
      handleLogin,
      handleForgotPassword,
      handleVerify,
      handleReset,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
