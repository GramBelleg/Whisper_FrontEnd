import React from "react";
import CustomInput from "../../common/CustomInput";

const ResetPassword = ({
  handleChange,
  handleSubmit,
  handleBlur,
  values,
  errors,
  touched,
  isSubmitting,
  loading,
  error,
  handleClose
}) => {
  const inputFields = [
    { type: "text", id: "resetCode", placeholder: "Reset Code" },
    { type: "password", id: "password", placeholder: "Password" },
    {
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm Password",
    },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-dark">
      
      <div className="form-container w-full max-w-md p-8 bg-light rounded-lg shadow-md">
        <button
              onClick={handleClose}
              className="text-xl text-gray-500 hover:text-gray-700 focus:outline-none"
        >
              &times; 
        </button>
        <h1 className="text-primary text-2xl font-bold mb-6 text-center">
          Reset Password
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full p-3 text-light bg-gray-700 border border-light rounded-md focus:border-primary focus:outline-none"
            />
          ))}
          {error && (
          <span className="text-red-600 text-sm mt-1">
            {error}
          </span>
          )}
          <button
            onClick={handleSubmit}
            className={`w-full py-2 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-dark transition duration-300 ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
