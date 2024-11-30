import React from 'react';
import CustomButton from './CustomButton';
import { FaGithub } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';

const GithubButton = ({classStyle}) => {
  const {loading} = useAuth();
  const handleGitAuth = () => {
    const clientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID;
    const redirectUri = 'http://localhost:5173/github-callback';
    const scope = 'user:email';

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <CustomButton
      icon={FaGithub}
      label="Sign In With Github"
      onClick={handleGitAuth}
      className={`${classStyle} flex flex-row items-center justify-center w-full`}
      id="githubBtn"
      disabled={loading}
    />
  );
};

export default GithubButton;
