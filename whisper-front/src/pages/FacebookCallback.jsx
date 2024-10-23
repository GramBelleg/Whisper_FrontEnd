import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const FacebookCallback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { handleFacebookSignUp } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const fetchUserData = async () => {
      if (code && !hasFetched.current) {
        hasFetched.current = true;
        await handleFacebookSignUp(code);
        navigate("/home");
      } else if (!code) {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, handleFacebookSignUp]);

  return (
    <div className="flex justify-center align-center items-center bg-light min-h-screen p-6">
      <p className="text-lg font-bold text-highlight">Processing Facebook authentication...</p>
    </div>
  );
};

export default FacebookCallback;
