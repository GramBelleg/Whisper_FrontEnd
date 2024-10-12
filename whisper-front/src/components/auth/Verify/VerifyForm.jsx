import React from 'react';
import CustomButton from '../../common/CustomButton';
import CustomInput from '../../common/CustomInput';

const VerifyForm = ({
    handleChange,
    handleSubmit,
    handleBlur,
    values = {},  
    errors = {},  
    touched = {},
    isSubmitting
}) => {
    const resendCode = () => {
        console.log("Resend code clicked");
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-center text-primary mb-4">
                    An email was sent with the verification code
                </h1>
                <p className="text-center mb-4">
                    Didn't receive the code?{' '}
                    <span className="text-primary underline cursor-pointer" onClick={resendCode}>
                        Resend verification email
                    </span>
                </p>
                <h3 className="text-lg font-medium text-primary mb-4 text-center">
                    Verification code
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CustomInput
                        type="password"
                        id="code"
                        placeholder="Enter 6-digit Code"
                        value={values.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.code}
                        touched={touched.code}
                    />
                    <CustomButton
                        label="Verify"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-dark transition duration-300"
                        type="submit"
                        disabled={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
};

export default VerifyForm;
