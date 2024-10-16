import React from "react";
import logo from "../assets/whisper_logo.png";
import SignupContainer from "../components/auth/Signup/SignupContainer";

const SignupPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-dark min-h-screen mt-4 ml-4 ">
      <SignupContainer />
      <div className="flex justify-center items-center">
        <img src={logo} alt="logo" className="w-80 md:w-96" />
      </div>
    </div>
  );
};

export default SignupPage;
