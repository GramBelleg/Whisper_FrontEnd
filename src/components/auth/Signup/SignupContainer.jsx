import { signupSchema } from '../../../utils/SignupSchema'
import { useFormik } from 'formik'
import SignupForm from './SignupForm'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const SignupContainer = () => {
    const navigate = useNavigate()
    const [country, setCountry] = useState('EG')
    const { handleSignUp, loading, error, clearError } = useAuth()

    const formatPhoneNumber = (phone) => {
        const phoneNumber = parsePhoneNumberFromString(phone, country)
        return phoneNumber ? phoneNumber.formatInternational() : phone
    }

    const handleCaptchaChange = (value) => {
        formik.setFieldValue('captcha', value)
    }

    useEffect(() => {
        clearError()
    }, [])

    const onSubmit = async (values, actions) => {
        //post request by axios
        console.log(values)
        const res = await handleSignUp({
            email: values.email,
            password: values.password,
            phoneNumber: formatPhoneNumber(values.phoneNumber),
            confirmPassword: values.confirmPassword,
            robotToken: values.captcha,
            userName: values.userName,
            name: values.name
        })
        if (res.success) {
            navigate('/email-verification')
            actions.resetForm()
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            userName: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            captcha: process.env.NODE_ENV === 'test'?'test-robot-token':''
        },
        validationSchema: signupSchema,
        onSubmit
    })

    return (
        <SignupForm
            handleChange={formik.handleChange}
            handleSubmit={formik.handleSubmit}
            handleBlur={formik.handleBlur}
            values={formik.values}
            handleCountryChange={setCountry}
            errors={formik.errors}
            touched={formik.touched}
            isSubmitting={formik.isSubmitting}
            handleCaptchaChange={handleCaptchaChange}
            loading={loading}
            error={error}
        />
    )
}

export default SignupContainer
