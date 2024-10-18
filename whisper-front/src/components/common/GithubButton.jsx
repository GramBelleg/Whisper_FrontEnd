import { FaGithub } from "react-icons/fa";
import { githubAuthRoute } from "../../utils/APIRoutes";
import CustomButton from "./CustomButton";

const GithubButton = ({ classStyle }) => {
  const handleGitAuth = () => {
    window.location.href = githubAuthRoute;
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
