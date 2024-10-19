import axios from 'axios';
import axiosInstance from './axiosInstance';
import authRoutes from '../utils/APIRoutes';

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(authRoutes.signup, userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Sign-up failed'+error.response.data.message);
  }
};

export const googleSignUp = async (codeResponse) => {
  try {
    const res = await axios.post(authRoutes.googleAuth, {
      code: codeResponse.code,
    });
    return res.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
  }
};

export const verify = async (code) => {
  try {
    const response = await axiosInstance.post(authRoutes.confirmEmail, code);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(authRoutes.login, credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("login error", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(authRoutes.sendResetCode, {
      email,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await axiosInstance.post(authRoutes.resetPassword, userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const setAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
