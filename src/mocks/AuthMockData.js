export const signupResponse = {
    status: 'success',
    userData: {
        name: 'Omar Mohammed',
        email: 'hanamostafa@gmail.com'
    }
}
export const verifyResponse = {
    status: 'success',
    message: 'created user'
}
export const loginResponse = {
    status: 'success',
    user: {
        name: 'Omar Mohammed',
        email: 'hanamostafa@gmail.com'
    },
    userToken: 'fake-token-JWT1234'
}
export const forgotPasswordResponse = {
    status: 'success',
    message: 'If the email exists in our system, a password reset link has been sent to it.'
}
export const resetPasswordResponse = {
    status: 'success',
    message: 'Reset Password successfully'
}
