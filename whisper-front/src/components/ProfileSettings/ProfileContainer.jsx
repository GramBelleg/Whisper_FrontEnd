import useAuth from '@/hooks/useAuth'
import EditableField from './EditFields/EditableField'
import EditablePhoneField from './EditFields/EditablePhoneField'
import EditProfilePic from './ProfilePicture/EditProfilePic'
import { useProfileSettings } from '@/hooks/useProfileSettings'
import { useModal } from '@/contexts/ModalContext'
import ModalVerify from './ModalVerify'
import VerifyEmail from '../auth/VerifyEmail/VerifyEmail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const ProfileContainer = ({popPage}) => {
    const { user } = useAuth()
    const {
        handleBioUpdate,
        handleNameUpdate,
        handleUserNameUpdate,
        handlePhoneUpdate,
        handleSendUpdateCode,
        handleResendUpdateCode,
        errors,
        clearError
    } = useProfileSettings()
    const { openModal, closeModal } = useModal()

    const handleEmailChange = async (pendingEmail) => {
        try {
            const response = await handleSendUpdateCode(pendingEmail);
            
            if (!response) {
                throw new Error('Failed to send update code');
            }
    
            return new Promise((resolve, reject) => {
                const closeCallback = (shouldClose) => {
                    if (shouldClose) {
                        closeModal();
                        resolve();
                    } else {
                        closeModal();
                        reject(new Error('Modal was closed without successful verification'));
                    }
                };
    
                openModal(() => (
                    <ModalVerify
                        email={pendingEmail}
                        closeModal={closeCallback}
                        resendCode={handleResendUpdateCode}
                    />
                ));
            });
        } catch (error) {
            throw error;
        }
    };
    

    return (
        <div>
            <div className='p-2 mb-6 flex gap-4 items-center'>
                {typeof popPage == 'function' && <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer text-white text-xl' onClick={()=> {popPage()}} />}
                <h1 className='text-xl text-light text-left'>Profile Settings</h1>
            </div>
            
            <EditProfilePic onEdit={() => handleEdit('profilePic')} />
            <EditableField
                initialText={user.bio}
                fieldName='Bio'
                id='bio'
                onSave={(value) => handleBioUpdate(value)}
                error={errors.bio}
                clearError={clearError}
            />
            <EditableField
                initialText={user.name}
                fieldName='Name'
                id='name'
                onSave={(value) => handleNameUpdate(value)}
                error={errors.name}
                clearError={clearError}
            />
            <EditableField
                initialText={user.userName}
                fieldName='User Name'
                id='userName'
                onSave={(value) => handleUserNameUpdate(value)}
                error={errors.userName}
                clearError={clearError}
            />
            <EditableField
                initialText={user.email}
                fieldName='Email'
                id='email'
                onSave={handleEmailChange}
                error={errors.email}
                clearError={clearError}
            />
            <EditablePhoneField
                initialPhone={user.phoneNumber}
                fieldName='Phone Number'
                id='phoneNumber'
                onSave={(value) => handlePhoneUpdate(value)}
                error={errors.phoneNumber}
                clearError={clearError}
            />
        </div>
    )
}

export default ProfileContainer
