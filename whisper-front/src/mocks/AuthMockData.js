export const signupResponse={
    "status": "success",
    "message": "unverified user",
    "isVerified":false,
    "role":"user"
}
export const verifyResonse={
    "status": "success",
    "message": "created user",
    "token": "fake-token",
    "isVerified":true,
    "role":"user"
}
export const loginResponse={
    "status": "success",
    "message": "User logged in successfully",
    "token": "fake-token",
    "email": "fake@gmail.com",
    "isVerified":true
}
export const forgotPasswordResponse={
    "message": "If the email exists in our system, a password reset link has been sent to it."
}
