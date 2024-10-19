import React from "react";
import authRoutes from "../../utils/APIRoutes";
import { FaFacebookF } from "react-icons/fa";
import CustomButton from "./CustomButton";

const FacebookButton = ({ classStyle }) => {
  const handleFacebookAuth = () => {
    window.location.href = authRoutes.facebookAuth;
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
