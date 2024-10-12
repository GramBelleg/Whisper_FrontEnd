import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { FaFacebookF } from 'react-icons/fa';

const FacebookButton = () => {
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
      redirectUri="google.com"
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="w-full p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2"
          disabled={renderProps.isDisabled}
        >
          <FaFacebookF className="mr-2" />
          Sign up with Facebook
        </button>
      )}
    />
  );
};

export default FacebookButton;
