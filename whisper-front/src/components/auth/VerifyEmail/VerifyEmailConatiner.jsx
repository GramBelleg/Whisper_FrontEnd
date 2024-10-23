import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import VerifyEmail from './VerifyEmail';
import ResendTimer from '../../common/ResendTimer';

const VerifyEmailContainer = () => {
    const [code, setCode] = useState('');
    const [canResend, setCanResend] = useState(true);
    const { handleVerify, handleResendCode, handleBackToSignUp, loading, error } = useAuth();

    const handleSubmit = async () => {
        await handleVerify(code);
        setCode('');
    };

    const handleChange = (e) => {
        setCode(e.target.value);
    };

    const resendCode = async () => {
        await handleResendCode();
        setCanResend(false);
    };

    const backToSignUp = async () => {
        handleBackToSignUp();
    };

    return (
        <VerifyEmail
            code={code}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            resendCode={resendCode}
            backToSignUp={backToSignUp}
            canResend={canResend} 
            setCanResend={setCanResend}
        />
    );
};

export default VerifyEmailContainer;
