import React from "react";
import { resetSchema } from "../../../utils/resetSchema";
import { useFormik } from "formik";
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const ResetPasswordContainer = ({email,handleClose}) => {
  const navigate = useNavigate();

  const {handleReset,loading,error}=useAuth();

  const onSubmit = async (values, actions) => {
    //post request by axios
    console.log("debugging")
    console.log(values)
    const res=await handleReset({email: email,
      password:values.password,
      confirmPassword:values.confirmPassword,
      code:values.resetCode});
    actions.resetForm();
    if(res.success){
        alert("Password reset successfully")
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      resetCode: "",
    },
    validationSchema: resetSchema,
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
      handleClose={handleClose}
    />
  );
};

export default ResetPasswordContainer;
