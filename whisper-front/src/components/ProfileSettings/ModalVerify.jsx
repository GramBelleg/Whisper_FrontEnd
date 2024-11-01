import React, { useState } from 'react';
import CustomButton from '../common/CustomButton';
import CustomInput from '../common/CustomInput';
import { useProfileSettings } from '@/hooks/useProfileSettings';

const ModalVerify = ({ email, closeModal }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const { handleEmailUpdate } = useProfileSettings();

    const handleSubmit = async () => {
        try {
            await handleEmailUpdate(email, verificationCode);
            closeModal();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className='p-6 bg-light flex flex-col relative'>
            <button 
                onClick={closeModal} 
                className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-800"
                aria-label="Close"
                id="button-close"
            >
                &times;
            </button>
            
            <CustomInput
                type='text'
                id='profile-verify-code'
                placeholder='Enter verification code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                error={errorMessage}
            />

            <CustomButton
                onClick={handleSubmit}
                className='bg-secondary-dark text-light p-2 rounded-xl hover:bg-primary duration-300 font-medium'
                label='Verify'
                id='button-profile-verify'
            />
        </div>
    );
};

export default ModalVerify;
