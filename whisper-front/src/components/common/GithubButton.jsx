import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import CustomButton from "./CustomButton";

const GithubButton = ({ classStyle }) => {
  const handleGitAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <div className={`${classStyle} flex flex-row items-center justify-center`}>
      <FaGithub className="mr-2" />
      <button onClick={handleGitAuth}>
        Sign In With Github
      </button>
    </div>
  );
};

export default GithubButton;
