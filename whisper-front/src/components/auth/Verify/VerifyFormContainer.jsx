import React from "react";
import { useFormik } from "formik";
import VerifyForm from "./VerifyForm";
import { verifySchema } from "../../../utils/verifySchema";

const VerifyFormContainer = () => {
  const onSubmit = (values, actions) => {
    console.log(values);
    //verify submitted code
    actions.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      code:"",
    },
    validationSchema: verifySchema,
    onSubmit,
  });
  return (
    <VerifyForm
      handleChange={formik.handleChange}
      handleSubmit={formik.handleSubmit}
      handleBlur={formik.handleBlur}
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      isSubmitting={formik.isSubmitting}
    />
  );
};

export default VerifyFormContainer;
