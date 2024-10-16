import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import VerifyEmail from './VerifyEmail';

const VerifyEmailConatiner = () => {
    const [code, setCode] = useState('');
    const {handleVerify,loading,error}=useAuth();

    const handleSubmit = async () => {
        handleVerify(code);
        setCode('');
    };
    const handleChange = (e) => {
        setCode(e.target.value);
    }

    const resendCode = () => {
    }

    return ( 
        <VerifyEmail 
         code={code}
         loading={loading}
         handleChange={handleChange}
         handleSubmit={handleSubmit} 
         resendCode={resendCode}/>
        
     );
}

export default VerifyEmailConatiner
