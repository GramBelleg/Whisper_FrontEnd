import React from 'react'
import CustomButton from './CustomButton'
import { FaGithub } from 'react-icons/fa'
import useAuth from '@/hooks/useAuth'

const GithubButton = ({ classStyle }) => {
    const { loading } = useAuth()
    const handleGitAuth = () => {
        const clientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
        console.log(clientId)
        const homeUrl = process.env.NODE_ENV === 'development' ? import.meta.env.VITE_APP_URL : import.meta.env.VITE_APP_SERVER_URL
        const redirectUri = `${homeUrl}/github-callback`
        console.log(redirectUri)
        const scope = 'user:email'

        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
        window.location.href = url
    }

    return (
        <CustomButton
            icon={FaGithub}
            label='Sign In With Github'
            onClick={handleGitAuth}
            className={`${classStyle} flex flex-row items-center justify-center w-full`}
            id='githubBtn'
            disabled={loading}
        />
    )
}

export default GithubButton
