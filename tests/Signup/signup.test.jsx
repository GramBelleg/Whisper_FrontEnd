import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignupContainer from '@/components/auth/Signup/SignupContainer'
import * as useAuth from '@/hooks/useAuth'
import React from 'react'
import SignupForm from '@/components/auth/Signup/SignupForm'

vi.mock('@/hooks/useAuth', () => ({
    default: vi.fn()
}))

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    MemoryRouter: ({ children }) => <div>{children}</div>
}))

vi.mock('react-google-recaptcha', () => ({
    __esModule: true,
    default: ({ onChange }) => <div data-testid='mock-v2-captcha-element' onClick={() => onChange('mock-captcha-token')} />
}))
describe('SignupContainer', () => {
    const mockHandleSignUp = vi.fn().mockResolvedValue({ success: true })
    const mockNavigate = vi.fn()
    const mockClearError = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NODE_ENV = 'development'
        useAuth.default.mockReturnValue({
            handleSignUp: mockHandleSignUp,
            loading: false,
            error: null,
            clearError: mockClearError
        })
        useNavigate.mockReturnValue(mockNavigate)
        render(
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <MemoryRouter>
                    <SignupContainer />
                </MemoryRouter>
            </GoogleOAuthProvider>
        )
    })

    it('renders the SignupForm with all necessary elements', () => {
        expect(screen.getByText(/Create Account/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('User name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();

        expect(screen.getByText(/Sign In With Google/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In With Github/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In With Facebook/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();

        expect(screen.getByText(/already a member\?/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Log in/i })).toBeInTheDocument();
    });

    it('submits the form and calls useNavigate and resetForm on success', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doel' } })
        fireEvent.change(screen.getByPlaceholderText(/User name/i), { target: { value: 'johndoel' } })
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'johndoe@example.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password123!' } })
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'Password123!' } })
        fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), { target: { value: '1234567890' } })

        const captchaCheckbox = screen.getByTestId('mock-v2-captcha-element')
        fireEvent.click(captchaCheckbox)

        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(mockHandleSignUp).toHaveBeenCalled()
            expect(mockNavigate).toHaveBeenCalledWith('/email-verification')
        })

        expect(screen.getByPlaceholderText('Name').value).toBe('')
        expect(screen.getByPlaceholderText(/User name/i).value).toBe('')
        expect(screen.getByPlaceholderText(/Email/i).value).toBe('')
        expect(screen.getByPlaceholderText('Password').value).toBe('')
        expect(screen.getByPlaceholderText(/Confirm Password/i).value).toBe('')
        expect(screen.getByPlaceholderText(/Phone Number/i).value).toBe('')
    })

    it('navigates to the login page when clicking the Log in link', () => {
        const loginLink = screen.getByRole('link', { name: /Log in/i });
        expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('displays validation errors for required fields', async () => {
        fireEvent.click(screen.getByText(/Sign Up/i))

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument()
            expect(screen.getByText('User name is required')).toBeInTheDocument()
            expect(screen.getByText('Email is required')).toBeInTheDocument()
            expect(screen.getByText('Password is required')).toBeInTheDocument()
            expect(screen.getByText('Password confirmation is required')).toBeInTheDocument()
            expect(screen.getByText('Phone number is required')).toBeInTheDocument()
            expect(screen.getByText('CAPTCHA is required')).toBeInTheDocument()
        })
    })

    it('shows error when passwords do not match', async () => {
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1234' } })
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'Password123' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Passwords must match')).toBeInTheDocument()
        })
    })

    it('validates that the name only contains letters and no special characters or numbers', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John 11*' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Name can only contain letters and spaces, without starting or ending spaces')).toBeInTheDocument()
        })
    })

    it('validates that the name has no consecutive spaces', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John  doess' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Name cannot contain consecutive spaces')).toBeInTheDocument()
        })
    })

    it('validates the minimum size for the name', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'JohnDoe' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 8 characters')).toBeInTheDocument()
        })
    })

    it('validates the username to only contain letters and numbers', async () => {
        fireEvent.change(screen.getByPlaceholderText('User name'), { target: { value: 'John 11*' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('User name can only contain letters and numbers')).toBeInTheDocument()
        })
    })

    it('validates the minimum size for the username', async () => {
        fireEvent.change(screen.getByPlaceholderText('User name'), { target: { value: 'JohnDoe' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('User name must be at least 8 characters')).toBeInTheDocument()
        })
    })

    it('validates that the password contains both upper and lower cases', async () => {
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'johndoe1' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Password must include both uppercase and lowercase letters.')).toBeInTheDocument()
        })
    })

    it('validates the minimum length of the password', async () => {
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'JohnDo' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('password must be at least 8 characters')).toBeInTheDocument()
        })
    })

    it("validates that the phone number can't be shorter than 10 characters", async () => {
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '20000' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText("Phone number can't be shorter than 10 characters")).toBeInTheDocument()
        })
    })

    it('validates the email format', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'JohnDoe' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
        })
    })

    it('validates the email format with signs', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user+test@example.com' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument()
        })
    })

    it('validates the email format with subdomains', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@mail.example.com' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument()
        })
    })

    it('validates the email format with no domain', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'JohnDoe@.com' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
        })
    })

    it('validates the email format with consecutive dots', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'JohnDoe@mail..com' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
        })
    })

    it('allows valid international names', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'José München' } })
        fireEvent.click(screen.getByText('Sign Up'))

        await waitFor(() => {
            expect(
                screen.queryByText('Name can only contain letters and spaces, without starting or ending spaces')
            ).not.toBeInTheDocument()
            expect(screen.queryByText('Name cannot contain consecutive spaces')).not.toBeInTheDocument()
        })
    })

    it('resets password error state on valid input', async () => {
        fireEvent.click(screen.getByText('Sign Up'))
        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument()
        })

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ohnoe' } })
        fireEvent.click(screen.getByText('Sign Up'))
        await waitFor(() => {
            expect(screen.getByText('password must be at least 8 characters')).toBeInTheDocument()
        })

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'johndoeko' } })
        fireEvent.click(screen.getByText('Sign Up'))
        await waitFor(() => {
            expect(screen.getByText('Password must include both uppercase and lowercase letters.')).toBeInTheDocument()
        })
    })

    it('disables submit button during form submission', async () => {
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByPlaceholderText('User name'), { target: { value: 'johndoe1' } })
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password123' } })
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'Password123' } })
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '+201234567890' } })

        const submitButton = screen.getByText('Sign Up')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(submitButton).toBeDisabled()
        })
    })

    it('clears error on mount', () => {
        expect(mockClearError).toHaveBeenCalled()
    })
})
