import { useState, useEffect, createContext } from 'react'
import {
    signUp,
    login,
    forgotPassword,
    verify,
    resetPassword,
    setAuthData,
    googleSignUp,
    facebookSignUp,
    githubSignUp,
    resendCode,
    logout,
    logoutAll
} from '../services/authService'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const tokenFromCookies = localStorage.getItem('token')
                if (tokenFromCookies) {
                    const response = await axios.get('http://localhost:5000/api/user/', {
                        headers: {
                            Authorization: `Bearer ${tokenFromCookies}`
                        }
                    })

                    setUser({
                        ...response.data,
                        userId: response.data.id,
                    });
                    setToken(tokenFromCookies)
                } else {
                    setError('No token found in cookies.')
                }
            } catch (error) {
                setError('Failed to fetch user data.')
                console.error('Error fetching user data:', error)
            }
        }

        fetchUser()
    }, [])

    const handleSignUp = async (userData) => {
        console.log(userData, 'handle sign up')
        setLoading(true)
        setError(null)
        try {
            console.log('signUp will get called')
            const data = await signUp(userData)
            console.log('user data', data)
            setUser(data.userData)
            setAuthData(data.userData, data.userToken)
            return { data: data, success: true }
        } catch (err) {
            console.log('error in auth', err.message)
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignUp = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await googleSignUp(userData)
            console.log(data)
            setUser({
                ...data.user,
                userId: data.user.id,
            })
            setToken(data.userToken)
            setAuthData(data.user, data.userToken)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFacebookSignUp = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await facebookSignUp(userData)
            console.log(data)
            setUser(data.user)
            setToken(data.userToken)
            setAuthData(data.user, data.userToken)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGithubSignUp = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await githubSignUp(userData)
            console.log(data)
            setUser({
                ...data.user,
                userId: data.user.id,
            })
            setToken(data.userToken)
            setAuthData(data.user, data.userToken)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (code) => {
        setLoading(true)
        setError(null)
        try {
            const data = await verify(code, user.email)
            setUser({
                ...data.data.user,
                userId: data.data.user.id,
            })
            setToken(data.data.userToken)
            setAuthData(data.data.user, data.data.userToken)
            return { data: data, success: true }
        } catch (err) {
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async (code) => {
        setLoading(true)
        setError(null)
        try {
            await resendCode(user.email)
        } catch (err) {
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleReset = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await resetPassword(userData)
            console.log(data)
            setToken(data.userToken)
            setUser({
                ...data.user,
                userId: data.user.id,
            })
            setAuthData(data.user, data.userToken)
            if (userData.logoutCheck) {
                await handleLogoutAll()
            }
            return { data: data, success: true }
        } catch (err) {
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            console.log(credentials)
            const data = await login(credentials)
            setToken(data.userToken)
            setUser({
                ...data.user,
                userId: data.user.id,
            })
            setAuthData(data.user, data.userToken)

            return { data, success: true }
        } catch (err) {
            console.log(err)
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (email) => {
        setLoading(true)
        setError(null)
        try {
            const data = await forgotPassword(email)
            return { data: data, success: true }
        } catch (err) {
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            await logout(token)
            setUser(null)
            setToken(null)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return { success: true }
        } catch (err) {
            console.log(err)
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }
    const handleLogoutAll = async () => {
        setLoading(true)
        setError(null)
        try {
            await logoutAll(token)
            setUser(null)
            setToken(null)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return { success: true }
        } catch (err) {
            console.log(err)
            setError(err.message)
            return { error: err, success: false }
        } finally {
            setLoading(false)
        }
    }

    const clearError = () => {
        setError(null)
    }

    const handleBackToSignUp = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const handleUpdateUser = (field, value) => {
        setUser((prevUser) => {
            const updatedUser = {
                ...prevUser,
                [field]: value
            }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            return updatedUser
        })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                handleSignUp,
                handleGoogleSignUp,
                handleFacebookSignUp,
                handleGithubSignUp,
                handleLogin,
                handleForgotPassword,
                handleUpdateUser,
                handleResendCode,
                handleVerify,
                handleReset,
                handleLogout,
                handleLogoutAll,
                clearError,
                handleBackToSignUp
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
