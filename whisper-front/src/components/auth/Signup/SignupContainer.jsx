import React from "react";
import { signupSchema } from "../../../utils/SignupSchema";
import { useFormik } from "formik";
import SignupForm from "./SignupForm";
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";

const SignupContainer = () => {
  const navigate = useNavigate();
  // const [message, setMessage] = useState("");

  const handleCaptchaChange = (value) => {
    formik.setFieldValue("captcha", value);
  };
  const {handleSignUp,loading,error}=useAuth();
  const onSubmit = async (values, actions) => {
    //post request by axios
    console.log(values)
    handleSignUp({email: values.email,password:values.password,phone:values.phoneNumber,captcha:values.captcha,isVerified:false});
    if(!error){
        navigate('/email-verification');
    }

    actions.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      captcha: "",
    },
    validationSchema: signupSchema,
    onSubmit,
  });
  return (
    <SignupForm
      handleChange={formik.handleChange}
      handleSubmit={formik.handleSubmit}
      handleBlur={formik.handleBlur}
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      isSubmitting={formik.isSubmitting}
      handleCaptchaChange={handleCaptchaChange}
      loading={loading}
      error={error}
    />
  );
};

export default SignupContainer;
