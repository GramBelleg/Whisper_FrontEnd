import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from "react-icons/fa";
import CustomButton from './CustomButton';

const GoogleButton = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={(response) => console.log('Google Success:', response)}
        onError={() => console.log('Google Login Failed')}
        render={(renderProps) => (
          <CustomButton
            icon={FaGoogle}
            label="Sign up with Google"
            className="w-full p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          />
        )}
      />
    </GoogleOAuthProvider>
  )
}

export default GoogleButton
