import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import { FaFacebookF } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const FacebookButton = ({ classStyle }) => {
  const {handleFacebookSignUp} = useAuth();
  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookAuth = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          sendTokenToBackend(accessToken);
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const sendTokenToBackend = async (token) => {
    try {
      await handleFacebookSignUp(token);
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
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
