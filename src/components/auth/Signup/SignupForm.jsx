import React from 'react'
import CustomInput from '../../common/CustomInput'
import ReCAPATCHA from 'react-google-recaptcha'
import GoogleButton from '../../common/GoogleButton'
import FacebookButton from '../../common/FacebookButton'
import GithubButton from '../../common/GithubButton'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CustomButton from '@/components/common/CustomButton'
import ErrorMessage from '@/components/common/ErrorMessage'

const SignupForm = ({
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    handleCountryChange,
    errors,
    touched,
    isSubmitting,
    handleCaptchaChange,
    loading,
    error
}) => {
    const inputFields = [
        { type: 'name', id: 'name', placeholder: 'Name' },
        { type: 'userName', id: 'userName', placeholder: 'User name' },
        { type: 'email', id: 'email', placeholder: 'Email' },
        { type: 'password', id: 'password', placeholder: 'Password' },
        {
            type: 'password',
            id: 'confirmPassword',
            placeholder: 'Confirm Password'
        }
    ]

    return (
        <div className='form-container p-6 '>
            <h1 className='text-primary text-2xl font-bold mb-4'>Create Account</h1>
            <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-2 gap-4 bg-dark p-4 rounded-lg'>
                {inputFields.map((field) => (
                    <CustomInput
                        key={field.id}
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        value={values[field.id]}
                        onChange={handleChange}
                        error={errors[field.id]}
                        touched={touched[field.id]}
                        className='w-full p-3 text-light bg-dark border border-light rounded-md focus:border-primary focus:outline-none'
                    />
                ))}
                <div>
                    <PhoneInput
                        country={'eg'}
                        value={values.phoneNumber}
                        onChange={(phone) => {
                            handleChange({ target: { name: 'phoneNumber', value: phone } })
                        }}
                        onCountryChange={(country) => {
                            handleCountryChange(country)
                        }}
                        placeholder='Phone Number'
                        inputClass='phone-input'
                        style={{}}
                        inputStyle={{ height: '3rem' }}
                        id='phoneNumber'
                    />
                    {touched.phoneNumber && <ErrorMessage error={errors.phoneNumber} id='error-phoneNumber' />}
                </div>
                <div>
                    <ReCAPATCHA sitekey="6LfwglwqAAAAAE0fN5qlj8ItyBHvbbeBSzF359tk" onChange={handleCaptchaChange} id='recaptcha' />
                    <ErrorMessage error={errors.captcha} id='error-recaptcha' />
                </div>
                <div>
                    <CustomButton
                        label='Sign Up'
                        onClick={handleSubmit}
                        id='signup-btn'
                        className='w-full p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        disabled={isSubmitting || loading}
                    />
                </div>
                <ErrorMessage error={error} id='error-signup' />
            </form>
            <div className='w-full border-t border-gray-200 mt-8 pt-6'>
                <GoogleButton
                    classStyle={`flex items-center justify-center p-3 font-bold rounded-lg transition duration-300 p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2`}
                />
                <GithubButton
                    classStyle={`flex items-center justify-center p-3 font-bold rounded-lg transition duration-300 p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2`}
                />
                <FacebookButton
                    classStyle={`flex items-center justify-center p-3 font-bold rounded-lg transition duration-300 p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2`}
                />

                <p className='text-light text-sm opacity-80 hover:opacity-100 transition duration-300'>
                    already a member?{' '}
                    <a href='/login' className='text-primary hover:underline' id='login-switch'>
                        Log in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SignupForm
