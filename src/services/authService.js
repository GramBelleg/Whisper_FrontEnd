import axios from 'axios';
import axiosInstance from './axiosInstance';
import authRoutes from '../utils/APIRoutes';
import { whoAmI } from './chatservice/whoAmI';

export const signUp = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signup", userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Sign-up failed'+error.response.data.message);
  }
};

export const googleSignUp = async (codeResponse) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/google", {
      code: codeResponse.code, 
    },{
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
  }
};

export const facebookSignUp = async (codeResponse) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/facebook", {
      code: codeResponse,
    },{
      withCredentials: true, // Ensure credentials are included
    });
    return res.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
  }
};

export const githubSignUp = async (codeResponse) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/github", {
      code: codeResponse,
    },{
      withCredentials: true, // Ensure credentials are included
    });
    return res.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
  }
};

export const verify = async (code,email) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/confirmEmail", {
      email: email, 
      code: code,   
  });
    console.log(response.data);
    return {data: response.data, success: true};
  } catch (error) {
    console.log("verify error", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const resendCode = async (email) => {
  try {
    const response = await axiosInstance.post(authRoutes.resendCode, {
      email: email, 
  });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("resend code error", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

export const login = async (credentials) => {
  try {
    
    const response = await axios.post("http://localhost:5000/api/auth/login", credentials, 
      { withCredentials: true }
    );
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
    console.log("reset password error", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const setAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  Object.assign(whoAmI, user ? user : {});
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  Object.assign(whoAmI, {});
};

export const logout = async (token) => {
  try {
    const response = await axios.get("http://localhost:5000/api/user/logoutOne",{
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("logout error", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
