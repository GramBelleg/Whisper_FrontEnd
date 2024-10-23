import React, { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';
import ResendTimer from '../../common/ResendTimer';

const ForgotPasswordContainer = () => {
    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const { handleForgotPassword, loading, error, clearError } = useAuth();

    useEffect(() => {
        clearError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleForgotPassword(email);
        if (res.success) {
            setResetPassword(true);
            setCanResend(false);
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
                            initialTime={60} 
                            canResend={canResend}
                            setCanResend={setCanResend}
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
