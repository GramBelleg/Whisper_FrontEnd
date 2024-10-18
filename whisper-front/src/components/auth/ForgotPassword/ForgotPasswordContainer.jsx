import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from '../../../hooks/useAuth';
import ResetPasswordContainer from '../ResetPassword/ResetPasswordContainer';
import { resetPassword } from '../../../services/authService';
const ForgotPasswordContainer = () => {

    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const {handleForgotPassword,loading,error}=useAuth();
    const handleSubmit = async () => {
        handleForgotPassword(email);
        setEmail('');
        if(!error)
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
         handleSubmit={handleSubmit} />}
         {
            resetPassword && <ResetPasswordContainer email={email} handleClose={handleClose} />
         }
         </div>
        
     );
}
 
export default ForgotPasswordContainer;