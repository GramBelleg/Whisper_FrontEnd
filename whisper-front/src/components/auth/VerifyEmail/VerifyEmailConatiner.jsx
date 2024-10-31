import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import VerifyEmail from './VerifyEmail';
import useResendTimer from '../../../hooks/useResendTimer';

const VerifyEmailContainer = () => {
    const [code, setCode] = useState('');
    const { handleVerify, handleResendCode, handleBackToSignUp, loading, error } = useAuth();
    const { timer, canResend, resetTimer } = useResendTimer(0,"lastVerifyTime");
    useEffect(() => {
        const lastResetTime = sessionStorage.getItem("lastVerifyTime");
        if (!lastResetTime) {
            resetTimer(60);  
        }
        console.log('Timer initialized', timer);
    }
    , []);

    const handleSubmit = async () => {
        const res=await handleVerify(code);
        setCode('');
        if(res.success){
            sessionStorage.removeItem("lastVerifyTime");
        }
    };

    const handleChange = (e) => {
        setCode(e.target.value);
    };

    const resendCode = async () => {
        await handleResendCode();
        resetTimer(60);
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
            timer={timer}
        />
    );
};

export default VerifyEmailContainer;
