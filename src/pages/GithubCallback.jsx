import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const GithubCallback = () => {
    const navigate = useNavigate()
    const hasFetched = useRef(false)
    const { handleGithubSignUp } = useAuth()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        const fetchUserData = async () => {
            if (code && !hasFetched.current) {
                hasFetched.current = true
                console.log('here')
                await handleGithubSignUp(code)
                navigate('/home')
            } else if (!code) {
                navigate('/login')
            }
        }

        fetchUserData()
    }, [navigate, handleGithubSignUp])

    return (
        <div className='flex justify-center align-center items-center bg-light min-h-screen p-6'>
            <p className='text-lg font-bold text-highlight'>Processing GitHub authentication...</p>
        </div>
    )
}

export default GithubCallback
