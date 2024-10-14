import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import CustomButton from "./CustomButton";

const GithubButton = ({ classStyle }) => {
  return (
    <div className={`${classStyle} flex flex-row items-center justify-center`}>
      <FaGithub className="mr-2" />
      <GitHubLogin
        clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
        onSuccess={(response) => console.log("GitHub Success:", response)}
        onFailure={() => console.log("GitHub Login Failed")}
        buttonText="Sign up with GitHub"
        redirectUri="http://localhost:3000/login"
      />
    </div>
  );
};

export default GithubButton;
