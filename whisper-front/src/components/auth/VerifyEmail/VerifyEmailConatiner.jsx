import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import VerifyEmail from './VerifyEmail';

const VerifyEmailConatiner = () => {
    const [code, setCode] = useState('');
    const {handleVerify,handleResendCode,handleBackToSignUp,loading,error}=useAuth();

    const handleSubmit = async () => {
        await handleVerify(code);
        setCode('');
    };
    const handleChange = (e) => {
        setCode(e.target.value);
    }

    const resendCode = async () => {
        await handleResendCode();
    }

    const backToSignUp = async () => {
        handleBackToSignUp();
    }

    return ( 
        <VerifyEmail 
         code={code}
         loading={loading}
         handleChange={handleChange}
         handleSubmit={handleSubmit} 
         error={error}
         resendCode={resendCode}
         backToSignUp={backToSignUp}/>
     );
}

export default VerifyEmailConatiner
