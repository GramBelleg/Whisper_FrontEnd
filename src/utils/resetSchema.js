import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const resetSchema = yup.object().shape({
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message: "Please create a stronger password, at least 1 upper case",
    })
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  resetCode: yup.string()
    .required("Code is required")
    .min(8, 'Code must be 8 characters')
});