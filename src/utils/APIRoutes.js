const authRoutes = {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    resendCode: '/api/auth/resendConfirmCode',
    confirmEmail: '/api/auth/confirmEmail',
    sendResetCode: '/api/auth/sendResetCode',
    resetPassword: '/api/auth/resetPassword',
    googleAuth: '/api/auth/google',
    facebookAuth: '/api/auth/facebook',
    githubAuth: '/api/auth/github',
    logOneOut: '/api/user/logoutOne',
    logAllOut: '/api/user/logoutAll',
    sendConfirmCode: '/api/auth/sendConfirmCode'
}

export default authRoutes
