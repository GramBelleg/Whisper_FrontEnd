import React, { useState } from "react";
import { signupSchema } from "../../../utils/SignupSchema";
import { useFormik } from "formik";
import SignupForm from "./SignupForm";
import useAuth from "../../../hooks/useAuth";
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
    handleSignUp(values);
    if(!error){
        navigate('/email-verification');
    }

    // try {
    //   const response = await fetch("/api/signup", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: values.email,
    //       phonenumber: values.phoneNumber,
    //       password: values.password,
    //     }),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     setMessage(data.message);
    //     navigate("/email-verification");
    //   } else {
    //     setMessage(data.message); 
    //   }
    // } catch (error) {
    //   setMessage("An error occurred during signup");
    // }
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
