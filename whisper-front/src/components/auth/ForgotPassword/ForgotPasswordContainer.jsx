import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';
import { useEffect } from 'react';

const ForgotPasswordContainer = () => {

    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const {handleForgotPassword,loading,error,clearError}=useAuth();

    useEffect(() => {
        clearError(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res=await handleForgotPassword(email);
        setEmail('');
        if(res.success)
        setResetPassword(true);
    };
    const handleChange = (e) => {
        setEmail(e.target.value);
    }
    const handleClose=()=>{
        setResetPassword(false);
    }
    return ( 
        <div>
        {!resetPassword && <ForgotPassword 
         email={email}
         loading={loading}
         handleChange={handleChange}
         handleSubmit={handleSubmit}
         error={error} />}
         
         {
            resetPassword && <ResetPasswordContainer
             email={email} 
             handleClose={handleClose}
             error={error}
              />
         }
         </div>
        
     );
}
 
export default ForgotPasswordContainer;