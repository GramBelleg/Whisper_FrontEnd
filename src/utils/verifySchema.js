import * as yup from "yup";

export const verifySchema = yup.object().shape({
    code: yup.string()
    .required("Code is required")
    .matches(/^\d{3}-\d{3}$/, "Code format should be ***-***"),
});