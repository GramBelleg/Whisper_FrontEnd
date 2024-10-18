import React from "react";
import { signupSchema as resetSchema } from "../../../utils/SignupSchema";
import { useFormik } from "formik";
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const ResetPasswordContainer = () => {
  const navigate = useNavigate();

  const {handleReset,loading,error}=useAuth();

  const onSubmit = async (values, actions) => {
    //post request by axios
    console.log("debugging")
    console.log(values)
    handleReset({email: values.email,password:values.password,confirmPassword:values.confirmPassword});
    actions.resetForm();
    if(!error){
        alert("Password reset successfully")
        navigate('/login');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetSchema.omit(["phoneNumber","captcha"]),
    onSubmit,
  });
  return (
    <ResetPassword
      handleChange={formik.handleChange}
      handleSubmit={formik.handleSubmit}
      handleBlur={formik.handleBlur}
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      isSubmitting={formik.isSubmitting}
      loading={loading}
      error={error}
    />
  );
};

export default ResetPasswordContainer;
