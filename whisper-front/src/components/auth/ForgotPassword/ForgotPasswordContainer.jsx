import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
const ForgotPasswordContainer = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        // post request by axios
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