import axiosInstance from '../axiosInstance'
import axios from 'axios'
import UserSocket from '../sockets/UserSocket'
import { downloadBlob, getBlobUrl, uploadBlob } from '@/services/blobs/blob'
import apiUrl from '@/config'

const userSocket = new UserSocket()

export const updateBio = async (bio) => {
    try {
        const response = await axios.put(
            `${apiUrl}/api/user/bio`,
            { bio },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating bio:', error)
        throw error
    }
}

export const updateName = async (name) => {
    try {
        const response = await axios.put(
            `${apiUrl}/api/user/name`,
            { name },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating name:', error)
        throw error
    }
}

export const updateUserName = async (userName) => {
    try {
        const response = await axios.put(
            `${apiUrl}/api/user/userName`,
            { userName },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating username:', error)
        throw error
    }
}

export const updatePhone = async (phone) => {
    try {
        const response = await axios.put(
            `${apiUrl}/api/user/phoneNumber`,
            { phoneNumber: phone },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating phone:', error)
        throw error
    }
}

export const updateEmail = async (email, code) => {
    try {
        const response = await axios.put(
            `${apiUrl}/api/user/email`,
            { email, code },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating email:', error)
        throw error
    }
}

export const sendUpdateCode = async (email) => {
    try {
        const response = await axios.post(
            `${apiUrl}/api/user/emailcode`,
            { email },
            {
                withCredentials: true
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating email:', error)
        throw error
    }
}

export const updateProfilePic = async (userID, file) => {
    try {
        console.log('updateProfilePic called')
        const token = localStorage.getItem('token')

        // Request to get a presigned URL for uploading
        const blobResponse = await axios.post(
            `${apiUrl}/api/media/write`,
            {
                fileName: file.name,
                fileType: file.type,
                fileExtension: file.name.split('.').pop()
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            }
        )

        if (!blobResponse || !blobResponse.data || !blobResponse.data.presignedUrl || !blobResponse.data.blobName) {
            throw new Error('Invalid response structure from API.')
        }

        const { presignedUrl, blobName } = blobResponse.data

        await uploadBlob(file, { presignedUrl: presignedUrl, blobName })

        userSocket.emitPFP({ userID, profilePic: blobName })

        const objectUrl = URL.createObjectURL(file) // Use the original `file` object
        console.log('Profile picture updated successfully, Object URL created:', objectUrl)

        return objectUrl // Return the Object URL
    } catch (error) {
        console.error('Error updating profile picture:', error)
        throw new Error(() => {
            if (error.response && error.response.data && error.response.data.message) {
                return error.response.data.message
            } else {
                return 'An error occurred while updating the profile picture'
            }
        })
    }
}

export const setProfilePic = async (blobName) => {
    try {
        // Generate an Object URL for the downloaded blob
        const blob = await getBlobUrl(blobName)
        console.log('Profile picture retrieved successfully, Object URL created:', blob)

        return blob.imageUrl // Return the Object URL
    } catch (error) {
        console.error('Error retrieving profile picture:', error)
        throw new Error(() => {
            if (error.response && error.response.data && error.response.data.message) {
                return error.response.data.message
            } else {
                return 'An error occurred while updating the profile picture'
            }
        })
    }
}

export const getPFP = async ({ userId, profilePic }) => {
    console.log('getpfp')
    if (profilePic) {
        const profilePicUrl = await setProfilePic(profilePic) // Resolve via setProfilePic
        console.log('getpfp res', profilePicUrl)
        return profilePicUrl
    } else if (profilePic === '') {
        // deleteProfilePic(userId);
    } else {
        console.error('No profile picture data received for the specified user')
        return null
    }
}

export const getProfilePic = async (userID, blobName) => {
    console.log('getProfilePic called', userID, blobName)
    const token = localStorage.getItem('token')

    try {
        if (!blobName) {
            console.log('No profile picture blob name available')
            return null
        }

        const blobResponse = await axiosInstance.post(
            `${apiUrl}/api/media/read`,
            { blobName: blobName },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            }
        )

        console.log('Blob response:', blobResponse)
        const { blob } = await downloadBlob(blobResponse.data)
        const newBlob = new Blob([blob])
        const objectUrl = URL.createObjectURL(newBlob)
        return objectUrl
    } catch (error) {
        console.error('Error fetching profile picture:', error)
        throw new Error(() => {
            if (error.response && error.response.data && error.response.data.message) {
                return error.response.data.message
            } else {
                return 'An error occurred while updating the profile picture'
            }
        })
    }
}

export const deleteProfilePic = async (userID) => {
    try {
        userSocket.emitPFP({ userID: userID, profilePic: '' })
        console.log('Sent profile pic set event with blobName:', '')
    } catch (error) {
        console.error('Error deleting profile picture:', error)
        throw new Error(() => {
            if (error.response && error.response.data && error.response.data.message) {
                return error.response.data.message
            } else {
                return 'An error occurred while updating the profile picture'
            }
        })
    }
}
