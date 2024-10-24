import React, { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';
import ResendTimer from '../../common/ResendTimer';
import useResendTimer from '../../../hooks/useResendTimer';

const ForgotPasswordContainer = () => {
    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const { handleForgotPassword, loading, error, clearError } = useAuth();
    const { timer, canResend, resetTimer } = useResendTimer(0,"lastResetTime");

    useEffect(() => {
        clearError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleForgotPassword(email);
        if (res.success) {
            setResetPassword(true);
            resetTimer(60);
        }
    };
    
    const handleChange = (e) => {
        setEmail(e.target.value);
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
