import loginSchema from "../../../utils/loginSchema";
import LoginForm from "./LoginForm";
import {useFormik} from "formik";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

   
const LoginContainer = () => {

    const {handleLogin,loading,error}=useAuth();
    const navigate = useNavigate();

    const onSubmit =async (values,actions) => {
        handleLogin(values);
        actions.resetForm();
        if (!error) {
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
