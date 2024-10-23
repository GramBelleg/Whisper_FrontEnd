import React from 'react';
import CustomInput from "../../common/CustomInput";
import CustomButton from "../../common/CustomButton";
import ResendTimer from '../../common/ResendTimer'; 

const VerifyEmail = ({ code, loading, handleChange, handleSubmit, error, resendCode, backToSignUp, canResend, setCanResend }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between h-[300px] p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center text-primary mb-4">
          Account Verification
        </h1>
        <p className="text-center mb-4">
          Didn't receive the code?{' '}
          <span
            className={`text-primary underline cursor-pointer ${!canResend || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canResend ? resendCode : null} 
          >
            Resend verification code
          </span>
        </p>

        {!canResend && (
          <ResendTimer
            initialTime={60} 
            canResend={canResend}
            setCanResend={setCanResend}
          />
        )}

        <h3 className="text-lg font-medium text-primary mb-4 text-center">
          Please Enter Verification Code
        </h3>
        <div className="w-4/5">
          <CustomInput
            type="password"
            id="code"
            placeholder="Enter 6-digit verification code"
            value={code}
            onChange={handleChange}
          />
        </div>
        {error && (
          <span className="text-red-600 text-sm mt-1">
            {error}
          </span>
        )}
        <CustomButton
          label="Verify"
          onClick={handleSubmit}
          disabled={loading}
          className="w-4/5 bg-primary text-white py-2 rounded-lg hover:bg-dark transition duration-300"
        />
        <div>
          <p className='text-dark underline cursor-pointer' onClick={backToSignUp}>Back To Sign Up</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
