import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import { FaFacebookF } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const FacebookButton = ({ classStyle }) => {
  const handleFacebookAuth = () => {
    const clientId = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:3000/facebook-callback");
    const scope = "public_profile,email";
  
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    window.location.href = authUrl;
  };
  

  return (
    <CustomButton
      icon={FaFacebookF}
      label="Sign In With Facebook"
      onClick={handleFacebookAuth}
      className={`${classStyle} flex flex-row w-full`}
    />
  );
};

export default FacebookButton;
