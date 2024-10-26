import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// min 8 characters, 1 upper case letter, 1 lower case letter.

export const signupSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message: "Password must include both uppercase and lowercase letters.",
    })
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  phoneNumber: yup.string().required("Phone number is required")
    .min(10, "Phone number can't be shorter than 10 characters")
    .max(15, "Phone number can't be longer than 15 characters"),
  captcha: yup.string().required('CAPTCHA is required'),
  name: yup.string().required("Name is required").min(8),
  userName: yup
    .string()
    .required("User name is required")
    .min(8, "User name must be at least 8 characters")
    .matches(/^[a-zA-Z0-9]+$/, "User name can only contain letters and numbers"),
});