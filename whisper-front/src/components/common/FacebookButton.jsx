import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { FaFacebookF } from 'react-icons/fa';

const FacebookButton = ({classStyle}) => {
  const handleResponse = (response) => {
    if (response.status === 'unknown') {
      console.error('Facebook Login Failed:', response);
    } else {
      console.log('Facebook Success:', response);
    }
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
      autoLoad={false}
      callback={handleResponse}
      fields="name,email,picture"
      cssClass={`${classStyle}`}
      redirectUri='http://localhost:3000/login'
    />
  );
};

export default FacebookButton;
