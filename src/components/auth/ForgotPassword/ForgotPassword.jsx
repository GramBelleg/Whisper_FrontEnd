import React from 'react'
import { Link } from 'react-router-dom'
import CustomInput from '../../common/CustomInput'
import CustomButton from '../../common/CustomButton'
import ErrorMessage from '@/components/common/ErrorMessage'

const ForgotPassword = ({ email, loading, handleChange, handleSubmit, error, canResend, emailError, children }) => {
    return (
        <div className='flex flex-col justify-center items-center min-h-screen px-4'>
            <div className='w-full max-w-md mx-auto flex flex-col items-center justify-between h-[300px] p-4 bg-white rounded-lg shadow-md'>
                <h1 className='text-xl font-semibold text-primary mb-2'>Forgot Password</h1>
                <p className='text-center mb-4'>Please enter your email to reset your password</p>
                <div className='w-4/5'>
                    <CustomInput type='email' id='email' placeholder='Email' value={email} onChange={handleChange} />
                </div>
                <CustomButton
                    label='Send Reset Email'
                    onClick={handleSubmit}
                    disabled={loading || !canResend}
                    className='w-4/5 bg-primary text-white py-2 rounded-lg hover:bg-dark transition duration-300'
                    id='send-reset-btn'
                    type='submit'
                    testId='send-reset-btn'
                />
                {children}
                <Link to='/login' className='text-primary underline mt-4' id='back-to-login'>
                    Back to login
                </Link>
                <ErrorMessage error={error} id='error-forgot-password' />
                <ErrorMessage error={emailError} id='email-error' />
            </div>
        </div>
    )
}

export default ForgotPassword
