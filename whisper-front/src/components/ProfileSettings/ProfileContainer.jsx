import useAuth from '@/hooks/useAuth';
import EditableField from './EditFields/EditableField';
import EditablePhoneField from './EditFields/EditablePhoneField'
import EditProfilePic from './ProfilePicture/EditProfilePic';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useModal } from '@/contexts/ModalContext';
import ModalVerify from './ModalVerify';
import VerifyEmail from '../auth/VerifyEmail/VerifyEmail';

const ProfileContainer = () => {
    const { user } = useAuth();
    const { handleBioUpdate, handleNameUpdate, handleUserNameUpdate, handlePhoneUpdate, handleSendUpdateCode, handleResendUpdateCode, errors, clearError } = useProfileSettings();
    const { openModal, closeModal } = useModal();

    const handleEmailChange = async (pendingEmail) => {
        const response = await handleSendUpdateCode(pendingEmail);
        if (response) {
            openModal(() => (
                <ModalVerify 
                    email={pendingEmail} 
                    closeModal={closeModal}
                    resendCode = {handleResendUpdateCode}
                />
            ));
        }
    }; 

    return (
        <div>
            <h1 className='text-xl text-light mb-6 text-left'>Profile Settings</h1>
            <EditProfilePic onEdit={() => handleEdit('profilePic')} />
            <EditableField 
                initialText={user.bio}
                fieldName='Bio'
                id='bio' 
                onSave={(value) => handleBioUpdate(value)} error={errors.bio}
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
    );
};

export default ProfileContainer;
