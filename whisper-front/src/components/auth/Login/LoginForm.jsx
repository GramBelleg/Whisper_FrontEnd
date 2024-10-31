import CustomInput from "../../common/CustomInput";
import { Link } from "react-router-dom";
import GoogleButton from '../../common/GoogleButton';
import GithubButton from '../../common/GithubButton';
import FacebookButton from '../../common/FacebookButton';
import ErrorMessage from '@/components/common/ErrorMessage';

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
          data-testid="login-btn"
          type="submit"
          onClick={handleSubmit}
          className={`w-full py-2 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-dark transition duration-300 ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting || loading}
          id="login-btn"
        >
          Login
        </button>
        <ErrorMessage error={error} id="error-login" />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm">Don't have an account?</span>
          <Link to="/signup" className="text-primary text-sm hover:underline" id="sign-up-link">
            Sign up
          </Link>
        </div>
        <Link to="/forgot-password" 
        className="text-primary text-sm hover:underline mt-2 block text-center"
        id="forgot-password-link" >
          Forgot Password?
        </Link>
      </form>
      <div className="w-full border-t border-gray-200 mt-8 pt-6">
        <GoogleButton classStyle="flex items-center justify-center w-full mb-3 bg-secondary text-white rounded-lg hover:bg-primary font-bold transition duration-300 p-3"/>
        <GithubButton classStyle="w-full p-3 mb-3 bg-secondary text-white rounded-lg hover:bg-primary font-bold transition duration-300"/>
        <FacebookButton classStyle=" flex items-center justify-center w-full p-3 mb-3 bg-secondary text-white rounded-lg hover:bg-primary font-bold transition duration-300"/>
      </div>
    </div>
  );
};

export default LoginForm;
