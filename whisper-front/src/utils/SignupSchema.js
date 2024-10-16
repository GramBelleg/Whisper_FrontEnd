import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter.

export const signupSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
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
  phoneNumber: yup.string().required("Required")
    .min(10, "Phone number can't be shorter than 10 characters")
    .max(15, "Phone number can't be longer than 15 characters"),
  captcha: yup.string().required('CAPTCHA is required'),
});