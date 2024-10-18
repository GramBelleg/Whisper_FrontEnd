import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const resetSchema = yup.object().shape({
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message: "Please create a stronger password, at least 1 upper case",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  resetCode: yup.string()
    .required("Code is required")
});