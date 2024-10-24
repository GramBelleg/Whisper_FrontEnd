import { useState, useEffect, createContext } from 'react';
import {
  signUp,
  login,
  forgotPassword,
  verify,
  resetPassword,
  setAuthData,
  googleSignUp,
  facebookSignUp,
  githubSignUp,
  resendCode,
} from '../services/authService';
import { loadAuthData } from '../services/tokenService';
import { whoAmI } from '@/services/chatservice/whoAmI';

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
      console.log("user data",data);  
      setUser(data.userData);                          
      setAuthData(data.userData, data.userToken);  
      return {data: data, success: true};
    } catch (err) {
      console.log("error in auth",err.message);
      setError(err.message);
      return { error: err, success: false };
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

  const handleFacebookSignUp = async (userData) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await facebookSignUp(userData);  
      setUser(data.user);      
      setToken(data.userToken);                    
      setAuthData(data.user, data.userToken);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = async (userData) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await githubSignUp(userData);  
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
      const data = await verify(code,user.email);    
      setToken(data.userToken);
      setUser(data);                          
      setAuthData(data, data.userToken);  
      return {data: data, success: true};
    } catch (err) {
      setError(err.message);
      return { error: err, success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (code) => {
    setLoading(true);
    setError(null); 
    try {
      await resendCode(user.email); 
    } catch (err) {
      setError(err.message);
      return { error: err, success: false };
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
      return {data: data, success: true};
    }catch(err){
      setError(err.message);
      return { error: err, success: false };
    }finally{
      setLoading(false);
    }
  }

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null); 
    try {
      console.log(credentials);
      
      const data = await login(credentials);  
      
      setToken(data.userToken); // Ensure userToken is correct
      setUser(data.user);                          
      setAuthData(data.user, data.userToken); // Use consistent naming for token
      
      return { data, success: true };
    } catch (err) {
      console.log(err);
      setError(err.message);
      return { error: err, success: false };
    } finally {
      setLoading(false);
    }
  };
  

  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError(null); 
    try {
      const data=await forgotPassword(email);
      return {data: data, success: true};

    } catch (err) {
      setError(err.message);
      return { error: err, success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Object.assign(whoAmI, {});
  };

  const clearError = () => {
    setError(null);
  };

  const handleBackToSignUp = () =>{
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Object.assign(whoAmI, {});
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      handleSignUp,
      handleGoogleSignUp,
      handleFacebookSignUp,
      handleGithubSignUp,
      handleLogin,
      handleForgotPassword,
      handleResendCode,
      handleVerify,
      handleReset,
      logout,
      clearError,
      handleBackToSignUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
