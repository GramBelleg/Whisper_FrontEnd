import React from "react";
import LoginContainer from "../components/auth/Login/LoginContainer";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 bg-dark min-h-screen">
      <LoginContainer />
    </div>
  );
};

export default LoginPage;
