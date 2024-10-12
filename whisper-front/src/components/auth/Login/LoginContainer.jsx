import loginSchema from "../../../utils/loginSchema";
import LoginForm from "./LoginForm";
import {useFormik} from "formik";
import { useNavigate } from "react-router-dom";

   
const LoginContainer = () => {

    const navigate = useNavigate();

    const onSubmit =async (values,actions) => {
        //axios request
        actions.resetForm();
       
    
      };
    const formik= useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit,
    });
    return (
        <LoginForm 
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

export default LoginContainer;
