import React, { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';

const ForgotPasswordContainer = () => {
    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [timer, setTimer] = useState(60);
    const { handleForgotPassword, loading, error, clearError } = useAuth();

    useEffect(() => {
        clearError();
    }, []);

    useEffect(() => {
        let interval;
        if (!canResend && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [canResend, timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleForgotPassword(email);
        if (res.success) {
            setResetPassword(true);
            setCanResend(false);
            setTimer(60);
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
                    timer={timer}
                />
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