import loginSchema from "../../../utils/loginSchema";
import LoginForm from "./LoginForm";
import {useFormik} from "formik";
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

   
const LoginContainer = () => {

    const {handleLogin,loading,error,clearError}=useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        clearError(); 
    }, [clearError]);

    const onSubmit =async (values,actions) => {
        const res=await handleLogin(values);
        actions.resetForm();
        if (res.success) {
            navigate('/chats');
        }
    
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
            loading={loading}
            error={error}
         />
    );
};

export default LoginContainer;
