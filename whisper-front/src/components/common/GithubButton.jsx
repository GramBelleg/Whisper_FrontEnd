import GitHubLogin from 'react-github-login';
import { FaGithub } from 'react-icons/fa';
import CustomButton from './CustomButton';

const GithubButton = () => (
  <GitHubLogin
    clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
    onSuccess={(response) => console.log('GitHub Success:', response)}
    onFailure={() => console.log('GitHub Login Failed')}
    buttonText="Sign up with GitHub"
    redirectUri="http://localhost:3000/login"
    render={(renderProps) => (
      <CustomButton
        icon={<FaGithub />}
        label="Sign up with GitHub"
        onClick={renderProps.onClick}
        className="w-full p-3 font-bold text-dark bg-white rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2"
      />
    )}
  />
);

export default GithubButton;
