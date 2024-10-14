import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from "react-icons/fa";
import CustomButton from './CustomButton';

const GoogleButton = ({classStyle}) => {
  return (
    <div
      className={`${classStyle}`}
    >
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={(response) => console.log('Google Success:', response)}
        onError={() => console.log('Google Login Failed')}
      />
    </GoogleOAuthProvider></div>
  )
}

export default GoogleButton
