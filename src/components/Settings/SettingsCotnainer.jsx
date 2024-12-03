import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SettingsPage.css'
import NoProfile from '@/assets/images/no-profile.svg?react'
import { faAt, faDatabase, faEnvelope, faEye, faLock, faPencil, faPhone } from '@fortawesome/free-solid-svg-icons'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import { useProfileSettings } from '@/hooks/useProfileSettings'
import ProfileStacked from '../ProfileSettings/ProfileStacked'
import useAuth from '@/hooks/useAuth'
import CopyButton from '../CopyButton/CopyButton'
import VisibilitySettings from '../VisibiltySettings/VisibilitySettings'
import BlockedUsers from '../BlockedUsers/BlockedUsers'
import StorageSettings from '../StorageSettings/StorageSettings'

const SettingsContainer = () => {
    const { user } = useAuth()
    const { profilePic } = useProfileSettings()
    const { push } = useStackedNavigation()
    const editProfile = () => {
        push(<ProfileStacked />)
    }
    return (
        <div className='settings' data-testid='test-settings-page'>
            <div className='flex gap-4 items-center justify-between header'>
                <h1>Settings</h1>
                <FontAwesomeIcon className='edit-icon cursor-pointer' icon={faPencil} onClick={editProfile} />
            </div>
            <div className='my-5'>
                <div className='relative inline-block cursor-pointer' onClick={editProfile}>
                    {profilePic ? (
                        <img src={profilePic} alt='Profile' className='w-40 h-40 rounded-full object-cover' />
                    ) : (
                        <NoProfile className='w-40 h-40 rounded-full object-cover' />
                    )}
                </div>
                <h3 className='cursor-pointer' onClick={editProfile}>
                    {user.name}
                </h3>
            </div>

            <div className='profile-info-container'>
                <div className='profile-info'>
                    <FontAwesomeIcon icon={faPhone} className='text-xl' />
                    <div className='details'>
                        <span className='detail-title'>{user.phoneNumber ? user.phoneNumber : 'No phone number'}</span>
                        <span className='detail-subtitle'>Phone</span>
                    </div>
                    <CopyButton content={user.phoneNumber ? user.phoneNumber : 'No phone number'} />
                </div>

                <div className='profile-info'>
                    <FontAwesomeIcon icon={faAt} className='text-xl' />
                    <div className='details'>
                        <span className='detail-title'>{user.userName ? user.userName : 'No username'}</span>
                        <span className='detail-subtitle'>Username</span>
                    </div>
                    <CopyButton content={user.userName ? user.userName : 'No username'} />
                </div>

                <div className='profile-info'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-xl' />
                    <div className='details'>
                        <span className='detail-title'>{user.email ? user.email : 'No email'}</span>
                        <span className='detail-subtitle'>Email</span>
                    </div>
                    <CopyButton content={user.email ? user.email : 'No email'} />
                </div>
            </div>

            <div className='separator'></div>

            <div className='list-container'>
                <h2 className='subtitle'>Privacy Settings</h2>

                <div
                    className='item'
                    onClick={() => {
                        push(<VisibilitySettings />)
                    }}
                >
                    <FontAwesomeIcon icon={faEye} className='list-item-icon' />
                    <span>Visibility Settings</span>
                </div>
                <div
                    className='item'
                    onClick={() => {
                        push(<BlockedUsers />)
                    }}
                >
                    <FontAwesomeIcon icon={faLock} className='list-item-icon' />
                    <span>Blocked Users</span>
                </div>
            </div>

            <div className='separator'></div>
            <div className='list-container'>
                <h2 className='subtitle'>Data & Storage</h2>
                <div
                    className='item'
                    onClick={() => {
                        push(<StorageSettings />)
                    }}
                >
                    <FontAwesomeIcon icon={faDatabase} className='list-item-icon' />
                    <span>Storage Settings</span>
                </div>
            </div>
        </div>
    )
}

export default SettingsContainer
