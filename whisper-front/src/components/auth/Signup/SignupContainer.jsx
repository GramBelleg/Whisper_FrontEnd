import React, { useState } from "react";
import { signupSchema } from "../../../utils/SignupSchema";
import { useFormik } from "formik";
import SignupForm from "./SignupForm";
import { useNavigate } from "react-router-dom";

const SignupContainer = () => {
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    formik.setFieldValue("captcha", value);
  };
  const onSubmit = (values, actions) => {
    // axios request
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
