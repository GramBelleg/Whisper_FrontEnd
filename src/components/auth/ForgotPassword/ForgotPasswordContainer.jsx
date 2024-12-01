import React, { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';
import ResendTimer from '../../common/ResendTimer';
import useResendTimer from '../../../hooks/useResendTimer';

const ForgotPasswordContainer = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [resetPassword, setResetPassword] = useState(false);
    const { handleForgotPassword, loading, error, clearError } = useAuth();
    const { timer, canResend, resetTimer } = useResendTimer(0,"lastResetTime");

    useEffect(() => {
        clearError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Email is required');
            console.log('Email is required!!!');
            return;
        } 
        else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            return;
        } 
        else {
            setEmailError('');
            e.preventDefault();
            const res = await handleForgotPassword(email);
            if (res.success) {
                setResetPassword(true);
                resetTimer(60);
            }
        }
    };
    
    const handleChange = (e) => {
        clearError();
        setEmail(e.target.value);
        setEmailError(null);
    };

    const handleClose = () => {
        setResetPassword(false);
    };

    return (
        <div>
            {!resetPassword && (
                <ForgotPassword
                    email={email}
                    loading={loading}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    canResend={canResend}
                    emailError={emailError}
                >
                    {!canResend && (
                        <ResendTimer
                            timer={timer}
                        />
                    )}
                </ForgotPassword>
            )}
            
            {resetPassword && (
                <ResetPasswordContainer
                    email={email}
                    handleClose={handleClose}
                    error={error}
                />
            )}
        </div>
    );
};

export default ForgotPasswordContainer;
