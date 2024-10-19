import { FaGithub } from "react-icons/fa";
import authRoutes from "../../utils/APIRoutes";
import CustomButton from "./CustomButton";

const GithubButton = ({ classStyle }) => {
  const handleGitAuth = () => {
    window.location.href = authRoutes.githubAuth;
  };

  return (
    <CustomButton
      icon={FaGithub}
      label="Sign In With Github"
      onClick={handleGitAuth}
      className={`${classStyle} flex flex-row items-center justify-center w-full`}
    />
  );
};

export default GithubButton;
