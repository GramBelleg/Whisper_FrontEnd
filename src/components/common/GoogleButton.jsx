import { useGoogleLogin } from '@react-oauth/google'
import { FaGoogle } from 'react-icons/fa'
import CustomButton from './CustomButton'
import useAuth from '../../hooks/useAuth'

const GoogleButton = ({ classStyle }) => {
    const { handleGoogleSignUp, loading, error } = useAuth()

    const handleGoogleAuth = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            await handleGoogleSignUp(codeResponse)
        }
    })
    return (
        <CustomButton
            icon={FaGoogle}
            label='Sign In With Google'
            onClick={handleGoogleAuth}
            className={`${classStyle} w-full`}
            disabled={loading}
            id='googleBtn'
        />
    )
}

export default GoogleButton
