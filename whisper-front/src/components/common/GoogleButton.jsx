import { useGoogleLogin} from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { googleAuthRoute } from "../../utils/APIRoutes";
import axios from "axios";
import CustomButton from "./CustomButton";

const GoogleButton = ({ classStyle }) => {
  const handleGoogleAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        console.log(codeResponse);
        // Send the authorization code to the backend
        const res = await axios.post(googleAuthRoute, {
          code: codeResponse.code,
        });
        console.log("Server response:", res.data);
      } catch (error) {
        console.error("Error exchanging code:", error);
      }
    },
  });
  return (
    <CustomButton
      icon={FaGoogle}
      label="Sign In With Google"
      onClick={handleGoogleAuth}
      className={`${classStyle} w-full`}
    />
  );
};

export default GoogleButton;
