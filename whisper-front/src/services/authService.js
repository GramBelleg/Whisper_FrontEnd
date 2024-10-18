import axiosInstance from './axiosInstance';

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/signup', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Sign-up failed');
  }
};

export const verify = async (code) => {
  try {
    const response = await axiosInstance.post('/verify', code);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('verify failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot-password', { email });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Forgot password failed');
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await axiosInstance.post('/reset-password', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Reset password failed');
  }
}

export const setAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

