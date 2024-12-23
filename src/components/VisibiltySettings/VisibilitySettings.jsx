import './VisibilitySettings.css'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import {
    putLastSeenVisibilitySettings,
    putMessagePreviewSetting,
    putProfilePicVisibilitySettings,
    putReadReceiptsSetting,
    putStoriesVisibilitySettings
} from '@/services/privacy/privacy'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import useAuth from '@/hooks/useAuth'

const VisibilitySettings = () => {
    const { user, handleUpdateUser } = useAuth()
    const [profilePictureVisibility, setProfilePictureVisibility] = useState(user.pfpPrivacy)
    const [storyVisibility, setStoryVisibility] = useState(user.storyPrivacy)
    const [lastSeenVisibility, setLastSeenVisibility] = useState(user.lastSeenPrivacy)
    const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(user.readReceipts)
    const [msgPreviewEnabled, setMsgPreviewEnabled] = useState(user.messagePreview)

    const { openModal, closeModal } = useModal()
    const { pop } = useStackedNavigation()

    const handleGoBack = () => {
        pop()
    }

    const updateLastSeenVisibilitySettings = async (setting) => {
        const prev = lastSeenVisibility
        setLastSeenVisibility(setting)
        handleUpdateUser('lastSeenPrivacy', setting)

        try {
            await putLastSeenVisibilitySettings(setting)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setLastSeenVisibility(prev)
        }
    }

    const updateProfilePicVisibiitySettings = async (setting) => {
        const prev = profilePictureVisibility
        setProfilePictureVisibility(setting)
        handleUpdateUser('pfpPrivacy', setting)

        try {
            await putProfilePicVisibilitySettings(setting)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setProfilePictureVisibility(prev)
        }
    }
    const updateStoryVisibilitySettings = async (setting) => {
        const prev = storyVisibility
        setStoryVisibility(setting)
        handleUpdateUser('storyPrivacy', setting)
        try {
            await putStoriesVisibilitySettings(setting)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setStoryVisibility(prev)
        }
    }

    const updateReadReceiptsSetting = async () => {
        const prev = readReceiptsEnabled
        setReadReceiptsEnabled(!prev)
        try {
            await putReadReceiptsSetting(!prev)

            handleUpdateUser('readReceipts', !prev)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setReadReceiptsEnabled(prev)
        }
    }

    const updateMessagePreviewSetting = async () => {
        const prev = msgPreviewEnabled
        setMsgPreviewEnabled(!prev)
        try {
            await putMessagePreviewSetting(!prev)
            handleUpdateUser('messagePreview', !prev)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setMsgPreviewEnabled(prev)
        }
    }

    useEffect(() => {
        setStoryVisibility(user.storyPrivacy)
        setProfilePictureVisibility(user.pfpPrivacy)
        setLastSeenVisibility(user.lastSeenPrivacy)
        setReadReceiptsEnabled(user.readReceiptsEnabled)
        setMsgPreviewEnabled(user.readReceiptsEnabled)
    }, [])
    return (
        <div className='visibility-settings' data-testid='test-visibility-page'>
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon data-testid='back-icon' className='back-icon' icon={faArrowLeft} onClick={handleGoBack} />
                <h1>Visibility Settings</h1>
            </div>
            <div className='who-can'>
                <div className='who-can-item'>
                    <h2>Who Can See My Profile Picture?</h2>
                    <div className='radio-group'>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-Everyone'
                                type='radio'
                                value='Everyone'
                                checked={profilePictureVisibility === 'Everyone'}
                                onChange={() => updateProfilePicVisibiitySettings('Everyone')}
                            />
                            Everyone
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-Contacts'
                                type='radio'
                                value='Contacts'
                                checked={profilePictureVisibility === 'Contacts'}
                                onChange={() => updateProfilePicVisibiitySettings('Contacts')}
                            />
                            My Contacts
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-noone'
                                type='radio'
                                value='Nobody'
                                checked={profilePictureVisibility === 'Nobody'}
                                onChange={() => updateProfilePicVisibiitySettings('Nobody')}
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className='who-can-item'>
                    <h2>Who Can See My Stories?</h2>
                    <div className='radio-group'>
                        <label>
                            <input
                                data-testid='story-visibility-Everyone'
                                type='radio'
                                value='Everyone'
                                checked={storyVisibility === 'Everyone'}
                                onChange={() => updateStoryVisibilitySettings('Everyone')}
                            />
                            Everyone
                        </label>
                        <label>
                            <input
                                data-testid='story-visibility-Contacts'
                                type='radio'
                                value='Contacts'
                                checked={storyVisibility === 'Contacts'}
                                onChange={() => updateStoryVisibilitySettings('Contacts')}
                            />
                            My Contacts
                        </label>
                        <label>
                            <input
                                data-testid='story-visibility-noone'
                                type='radio'
                                value='Nobody'
                                checked={storyVisibility === 'Nobody'}
                                onChange={() => updateStoryVisibilitySettings('Nobody')}
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className='who-can-item'>
                    <h2>Who Can See My Last Seen?</h2>
                    <div className='radio-group'>
                        <label>
                            <input
                                data-testid='last-seen-Everyone'
                                type='radio'
                                value='Everyone'
                                checked={lastSeenVisibility === 'Everyone'}
                                onChange={() => updateLastSeenVisibilitySettings('Everyone')}
                            />
                            Everyone
                        </label>
                        <label>
                            <input
                                data-testid='last-seen-Contacts'
                                type='radio'
                                value='Contacts'
                                checked={lastSeenVisibility === 'Contacts'}
                                onChange={() => updateLastSeenVisibilitySettings('Contacts')}
                            />
                            My Contacts
                        </label>
                        <label>
                            <input
                                data-testid='last-seen-nooone'
                                type='radio'
                                value='Nobody'
                                checked={lastSeenVisibility === 'Nobody'}
                                onChange={() => updateLastSeenVisibilitySettings('Nobody')}
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className='who-can-item toggle-container'>
                    <h2>Read Receipts</h2>
                    <div className='toggle-switch'>
                        <input
                            data-testid='toggle-switch-test'
                            type='checkbox'
                            id='readReceipts'
                            checked={readReceiptsEnabled}
                            onChange={() => updateReadReceiptsSetting()}
                        />
                        <label htmlFor='readReceipts' className='toggle-label'></label>
                    </div>
                </div>
                <div className='who-can-item'>
                    <h2>Notifications</h2>
                    <div className='flex justify-between'>
                            Message Preview
                            <div className='toggle-switch'>
                            <input
                                data-testid='toggle-switch-message-preview'
                                type='checkbox'
                                id='messagePreview'
                                checked={msgPreviewEnabled}
                                onChange={updateMessagePreviewSetting}
                            />
                            <label htmlFor='messagePreview' className='toggle-label'></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VisibilitySettings
