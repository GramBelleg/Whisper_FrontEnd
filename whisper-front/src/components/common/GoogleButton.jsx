import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import CustomButton from "./CustomButton";
import axios from "axios";

const GoogleButton = ({ classStyle }) => {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        console.log(codeResponse);
        // Send the authorization code to the backend
        const res = await axios.post("http://localhost:5000/api/auth/google", {
          code: codeResponse.code,
        });
        console.log("Server response:", res.data);
      } catch (error) {
        console.error("Error exchanging code:", error);
      }
    },
  });
  return (
    <div className={`${classStyle}`} onClick={() => login()}>
      <FaGoogle className="mr-2" />
      <button>Sign in with Google</button>
    </div>
  );
};

export default GoogleButton;
