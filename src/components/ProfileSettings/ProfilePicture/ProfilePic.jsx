import { useProfileSettings } from '@/hooks/useProfileSettings'
import NoProfile from '@/assets/images/no-profile.svg?react'

const ProfilePic = ({ handleClick }) => {
    const { profilePic } = useProfileSettings()
    return (
        <div className='flex items-center justify-center'>
            <button onClick={handleClick} className='flex items-center justify-center'>
                {profilePic ? (
                    <img
                        src={profilePic}
                        alt='profile picture'
                        className='w-12 h-12 rounded-full object-cover border-2 border-gray-300 m-2' // Changed to w-16 h-16 for smaller size
                    />
                ) : (
                    <NoProfile className='w-12 h-12 rounded-full object-cover border-2 border-gray-300 m-2' />
                )}
            </button>
        </div>
    )
}

export default ProfilePic
