import ProfileContainer from '@/components/ProfileSettings/ProfileContainer'

const ProfileSettingsPage = ({ popPage }) => {
    return (
        <div className='p-4'>
            <ProfileContainer popPage={popPage} />
        </div>
    )
}

export default ProfileSettingsPage
