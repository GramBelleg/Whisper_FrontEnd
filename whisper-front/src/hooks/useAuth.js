import { useState, useEffect } from 'react';
import { signUp, login } from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);      
  const [token, setToken] = useState(null);    // jwt token
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);    


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); //stored as JSON string

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); 
    }
  }, []);


  const handleSignUp = async (userData) => {
    setLoading(true);
    setError(null); 
    try {
      const data = await signUp(userData);    
      setToken(data.token);
      setUser(data);                          
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  return {
    user,
    token,
    loading,
    error,
    handleSignUp,
    handleLogin,
  };
};

export default useAuth;
