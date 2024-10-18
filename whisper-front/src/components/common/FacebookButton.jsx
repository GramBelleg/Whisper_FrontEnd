import React from "react";
import FacebookLogin from "react-facebook-login";
import { FaFacebookF } from "react-icons/fa";

const FacebookButton = ({ classStyle }) => {
  const handleFacebookAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/facebook";
  };

  return (
    <div className={`${classStyle} flex flex-row`} onClick={handleFacebookAuth}>
      <FaFacebookF  className="mr-2"/>
      <button>Sign In With Facebook</button>
    </div>
  );
};

export default FacebookButton;
