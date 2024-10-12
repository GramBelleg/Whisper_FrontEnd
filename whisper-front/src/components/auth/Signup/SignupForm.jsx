import React from "react";
import CustomInput from "../../common/CustomInput";
import ReCAPATCHA from "react-google-recaptcha";
import GoogleButton from "../../common/GoogleButton";
import FacebookButton from "../../common/FacebookButton";
import GithubButton from "../../common/GithubButton";

const SignupForm = ({
  handleChange,
  handleSubmit,
  handleBlur,
  values,
  errors,
  touched,
  isSubmitting,
  handleCaptchaChange,
  loading,
  error
}) => {
  const inputFields = [
    { type: "email", id: "email", placeholder: "Email" },
    { type: "tel", id: "phoneNumber", placeholder: "Phone Number" },
    { type: "password", id: "password", placeholder: "Password" },
    {
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm Password",
    },
  ];

  return (
    <div className="form-container p-6">
      <h1 className="text-primary text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-dark p-4 rounded-lg">
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
            className="w-full p-3 text-light bg-dark border border-light rounded-md focus:border-primary focus:outline-none"
          />
        ))}
        <ReCAPATCHA sitekey={process.env.REACT_APP_SITE_KEY} onChange={handleCaptchaChange} />
        {errors.captcha && <label className="text-red-600 text-sm mt-1">{errors.captcha}</label>}
        <button
          onClick={handleSubmit}
          className="w-full p-3 font-bold text-dark bg-light rounded-lg cursor-pointer hover:bg-primary hover:text-light transition duration-300 mt-2 mb-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting || loading}
          type="submit"
        >
          Sign Up
        </button>
        {error && <label className="text-red-600 text-sm mt-1">{error}</label>}
      </form>
      <div className="flex flex-col items-center border-t border-light mt-8 py-4 w-full">
        <GoogleButton/>
        <FacebookButton/>
        <GithubButton/>
        <p className="text-light text-sm opacity-80 hover:opacity-100 transition duration-300">
          already a member? <a href="/login" className="text-primary hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
