import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import useAuth from "../../../hooks/useAuth";
const ForgotPasswordContainer = () => {

    const [email, setEmail] = useState('');
    const {handleForgotPassword,loading,error}=useAuth();
    const handleSubmit = async () => {
        // post request by axios
        handleForgotPassword(email);
        setEmail('');
    };
    const handleChange = (e) => {
        setEmail(e.target.value);
    }
    return ( 
        <ForgotPassword 
         email={email}
         loading={loading}
         handleChange={handleChange}
         handleSubmit={handleSubmit} />
        
     );
}
 
export default ForgotPasswordContainer;