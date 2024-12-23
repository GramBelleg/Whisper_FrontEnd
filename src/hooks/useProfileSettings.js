import { useEffect, useRef, useState } from 'react'
import { useProfileContext } from '@/contexts/ProfileSettingsContext'
import {
    updateBio,
    updateName,
    updateUserName,
    updatePhone,
    updateEmail,
    sendUpdateCode,
    updateProfilePic,
    getProfilePic,
    deleteProfilePic,
    getPFP
} from '@/services/profileServices/ProfileSettingsService'
import useAuth from './useAuth'
import UserSocket from '@/services/sockets/UserSocket'

export const useProfileSettings = () => {
    const { profilePic, setProfilePic } = useProfileContext()
    const [errors, setErrors] = useState({ bio: null, name: null, userName: null, profilePic: null })
    const { handleUpdateUser, user } = useAuth()
    const [loading, setLoading] = useState(false)
    const userSocket = new UserSocket()

    const fetchProfilePic = async () => {
        try {
            const profilePicUrl = await getProfilePic(user.id, user.profilePic)
            if (profilePicUrl) setProfilePic(profilePicUrl)
        } catch (err) {
            setErrors((prev) => ({ ...prev, profilePic: 'Error fetching profile picture.' }))
            console.error('Error fetching profile picture:', err)
        }
    }

    useEffect(() => {
        if (!profilePic) {
            fetchProfilePic()
            console.log('Fetching profile pic...')
        }
        if (!userSocket) {
            console.error('userSocket is not initialized')
            return
        }

        const onPFPUpdate = async (data) => {
            console.log("Received 'pfp' event data:", data)

            if (data.userId !== user.id) return

            console.log('User socket received matching pfp event:', data)

            try {
                const updatedPFP = await getPFP({
                    userId: data.userId,
                    profilePic: data.profilePic
                })

                console.log('Resolved profile picture URL:', updatedPFP)

                setProfilePic(updatedPFP)
                // TODO: whoAmI.profilePic = updatedPFP
            } catch (error) {
                console.error('Error in onPFPUpdate:', error)
            }
        }

        userSocket.onPFP(onPFPUpdate)

        return () => {
            userSocket.offPFP(onPFPUpdate)
        }
    }, [userSocket, user.id])

    const handleBioUpdate = async (newBio) => {
        try {
            setErrors((prevErrors) => ({ ...prevErrors, bio: null }))
            const response = await updateBio(newBio)
            handleUpdateUser('bio', newBio)
            return response
        } catch (err) {
            setErrors((prevErrors) => ({ ...prevErrors, bio: err.message || 'Error updating bio.' }))
            console.error('Error updating bio:', err)
        }
    }

    const handleNameUpdate = async (newName) => {
        const nameRegex = /^(?! )[a-zA-Z\p{L}\s]+(?<! )$/u
        const consecutiveSpacesRegex = /^(?!.*\s{2,})/

        if(newName.length<8)
        {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name must be at least 8 characters'
            }))
            throw new Error()
        }

        if (!nameRegex.test(newName)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name can only contain letters and spaces, without starting or ending spaces.'
            }))
            throw new Error()
        }

        if (!consecutiveSpacesRegex.test(newName)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name cannot contain consecutive spaces.'
            }))
            throw new Error()
        }

        try {
            setErrors((prevErrors) => ({ ...prevErrors, name: null }))
            const response = await updateName(newName)
            handleUpdateUser('name', newName)
            return response
        } catch (err) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: err.message || 'Error updating name.'
            }))
            console.error('Error updating name:', err)
        }
    }

    const handleUserNameUpdate = async (newUserName) => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;

        if(newUserName.length <8)
            {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: 'Username must be at least 8 characters'
                }))
                throw new Error()
            }

        if (!usernameRegex.test(newUserName)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                userName: 'User name can only contain letters and numbers'
            }))
            throw new Error()
        }

        try {
            setErrors((prevErrors) => ({ ...prevErrors, userName: null }))
            const response = await updateUserName(newUserName)
            handleUpdateUser('userName', newUserName)
            return response
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, userName: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, userName: 'An unexpected error occurred' }))
            }
            throw err
        }
    }

    const handlePhoneUpdate = async (newPhoneNumber) => {
        try {
            console.log(newPhoneNumber)
            setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: null }))
            const response = await updatePhone(newPhoneNumber)
            handleUpdateUser('phoneNumber', newPhoneNumber)
            return response
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'An unexpected error occurred' }))
            }
            throw err
        }
    }

    const handleSendUpdateCode = async (newEmail) => {
        try {
            setErrors((prevErrors) => ({ ...prevErrors, email: null }))

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(newEmail)) {
                throw new Error('Invalid email format')
            }

            const response = await sendUpdateCode(newEmail)
            return response
        } catch (err) {
            if (err.message === 'Invalid email format') {
                setErrors((prevErrors) => ({ ...prevErrors, email: err.message }))
            } else if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, email: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'An unexpected error occurred' }))
            }
            throw err
        }
    }

    const handleResendUpdateCode = async (newEmail) => {
        try {
            const response = await sendUpdateCode(newEmail)
            return response
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, email: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'An unexpected error occurred' }))
            }
            throw err
        }
    }

    const handleEmailUpdate = async (newEmail, code) => {
        try {
            setErrors((prevErrors) => ({ ...prevErrors, verifyCode: null }))
            const response = await updateEmail(newEmail, code)
            handleUpdateUser('email', newEmail)
            return response
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, verifyCode: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, verifyCode: 'An unexpected error occurred' }))
            }
            throw err
        }
    }
    const handleProfilePicUpdate = async (newProfilePic) => {
        try {
            setErrors((prevErrors) => ({ ...prevErrors, profilePic: null }))
            console.log('will call updateProfilePic from service')
            setLoading(true)
            const updatedProfilePic = await updateProfilePic(user.id, newProfilePic)
            setProfilePic(updatedProfilePic)
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, profilePic: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, profilePic: 'An unexpected error occurred' }))
            }
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleProfilePicDelete = async () => {
        try {
            setErrors((prevErrors) => ({ ...prevErrors, profilePic: null }))
            console.log('will call delteProfilePic from service')
            setLoading(true)
            const response = await deleteProfilePic(user.id)
            setProfilePic(null)
            return response
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors((prevErrors) => ({ ...prevErrors, profilePic: err.response.data.message || 'An error occurred' }))
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, profilePic: 'An unexpected error occurred' }))
            }
            throw err
        } finally {
            setLoading(false)
        }
    }

    const clearError = (id) => {
        setErrors((prevErrors) => ({ ...prevErrors, [id]: null }))
    }

    return {
        profilePic,
        setProfilePic,
        errors,
        loading,
        handleBioUpdate,
        handleNameUpdate,
        handleUserNameUpdate,
        handlePhoneUpdate,
        handleEmailUpdate,
        handleSendUpdateCode,
        handleResendUpdateCode,
        clearError,
        handleProfilePicUpdate,
        handleProfilePicDelete
    }
}
