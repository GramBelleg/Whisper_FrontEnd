import React from 'react';
import CustomButton from "../../common/CustomButton";
import CustomInput from "../../common/CustomInput";
import { FaGithub, FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

const LoginForm = ({
  handleChange,
  handleSubmit,
  handleBlur,
  values,
  errors,
  touched,
  isSubmitting,
  loading,
  error
}) => {
  const inputFields = [
    { type: "email", id: "email", placeholder: "Email" },
    { type: "password", id: "password", placeholder: "Password" },
  ];

  const buttonConfigs = [
    { label: "Log in with Google", icon: FaGoogle },
    { label: "Log in with Facebook", icon: FaFacebookF },
    { label: "Log in with Github", icon: FaGithub },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto my-10 p-6 bg-light rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-primary mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full">
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
          />
        ))}
        <button
          type="submit"
          onClick={handleSubmit}
          className={`w-full py-2 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-dark transition duration-300 ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting || loading}
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm">Don't have an account?</span>
          <Link to="/signup" className="text-primary text-sm hover:underline">
            Sign up
          </Link>
        </div>
        <Link to="/forgot-password" className="text-primary text-sm hover:underline mt-2 block text-center">
          Forgot Password?
        </Link>
      </form>
      <div className="w-full border-t border-gray-200 mt-8 pt-6">
        {buttonConfigs.map((button, index) => (
          <CustomButton
            key={index}
            icon={button.icon}
            label={button.label}
            onClick={() => console.log(`Clicked ${button.label}`)}
            className="w-full py-2 mb-3 bg-secondary text-white rounded-lg hover:bg-dark transition duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default LoginForm;
