import React, { useState } from 'react'
import CustomButton from '../common/CustomButton'
import CustomInput from '../common/CustomInput'
import { useProfileSettings } from '@/hooks/useProfileSettings'
import useResendTimer from '@/hooks/useResendTimer'

const ModalVerify = ({ email, closeModal, resendCode }) => {
    const [verificationCode, setVerificationCode] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const { handleEmailUpdate } = useProfileSettings()
    const { timer, canResend, resetTimer } = useResendTimer(60, 'lastResendTime')

    const handleSubmit = async () => {
        try {
            await handleEmailUpdate(email, verificationCode)
            closeModal(true)
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred')
        }
    }

    const handleResendCode = async () => {
        await resendCode(email)
        resetTimer(60)
    }

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await handleSubmit()
        }
    }

    return (
        <div className='p-6 bg-light flex flex-col relative'>
            <button
                onClick={() => closeModal(false)}
                className='absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-800'
                aria-label='Close'
                id='button-close'
            >
                &times;
            </button>

            <h4 className='text-lg font-semibold text-center text-gray-700 mb-2'>Please enter the verification code sent to your email</h4>
            <CustomInput
                type='text'
                id='profile-verify-code'
                placeholder='Enter verification code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                error={errorMessage}
                onKeyPress={handleKeyPress}
            />

            <CustomButton
                onClick={handleSubmit}
                className='bg-secondary-dark text-light p-2 rounded-xl hover:bg-highlight duration-300 font-medium'
                label='Verify'
                id='button-profile-verify'
            />

            <CustomButton
                onClick={handleResendCode}
                disabled={!canResend}
                className='bg-secondary text-light p-2 rounded-xl hover:bg-highlight duration-300 font-medium mt-4'
                label={canResend ? 'Resend Code' : `Resend in ${timer}s`}
                id='button-resend-code'
            />
        </div>
    )
}

export default ModalVerify
