import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import ForgotPasswordContainer from '@/components/auth/ForgotPassword/ForgotPasswordContainer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';
import useResendTimer from '@/hooks/useResendTimer';

vi.mock('@/hooks/useResendTimer', () => ({
    __esModule: true,
    default: vi.fn(),
}));

describe('ForgotPasswordContainer', () => {
    let mockHandleForgotPassword;
    let mockClearError;
    let defaultAuthContextValue;

    beforeEach(() => {
        mockHandleForgotPassword = vi.fn().mockResolvedValue({ success: true });
        mockClearError = vi.fn();

        defaultAuthContextValue = {
            handleForgotPassword: mockHandleForgotPassword,
            loading: false,
            error: '',
            clearError: mockClearError,
        };
        useResendTimer.mockReturnValue({
            timer: 0,
            canResend: true, 
            resetTimer: vi.fn(),
        });

    });
    const renderForgotPasswordContainer = (contextValue = {}) => {
        return render(
            <MemoryRouter>
                    <AuthContext.Provider value={{ ...defaultAuthContextValue, ...contextValue }}>
                        <ForgotPasswordContainer />
                    </AuthContext.Provider>
            </MemoryRouter>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it('renders the forgot password form', () => {
        renderForgotPasswordContainer();
        const heading = screen.getByRole('heading', { name: /Forgot Password/i });
        expect(heading).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Reset Email/i })).toBeInTheDocument();
    });

    it('handles input change', () => {
        renderForgotPasswordContainer();
        const emailInput = screen.getByPlaceholderText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'hanamostafa@gmail.com' } });
        expect(emailInput.value).toBe('hanamostafa@gmail.com');
    });

    it('handles form submission', async () => {
        renderForgotPasswordContainer();
        const emailInput = screen.getByPlaceholderText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'hanamostafa@gmail.com' } });

        const submitButton = screen.getByRole('button', { name: /Send Reset Email/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockHandleForgotPassword).toHaveBeenCalledWith('hanamostafa@gmail.com');
        });
    });

    it('renders error message when email is invalid', async () => {
        renderForgotPasswordContainer();
        const email = 'invalid-email';
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: email } });
        
        const submitButton = screen.getByRole('button', { name: /Send Reset Email/i });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/Email is invalid/i)).toBeInTheDocument();
        });
    });

    it('renders error message when email is required', async () => {
        renderForgotPasswordContainer();
        const submitButton = screen.getByRole('button', { name: /Send Reset Email/i });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        });
    });

    it('renders error message when there is an auth error', async () => {
        const errorMessage = 'Invalid email or password';
        renderForgotPasswordContainer({ error: errorMessage });

        expect(await screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
    it('navigates to login page when Back to Login link is clicked', () => {
        render(
            <AuthContext.Provider value={defaultAuthContextValue}>
                <MemoryRouter initialEntries={['/forgot-password']}>
                    <Routes>
                    <Route path="/forgot-password" element={<ForgotPasswordContainer />} />
                    <Route path="/login" element={<h1>Login Page</h1>} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        const backToLoginLink = screen.getByText(/Back to Login/i);
        expect(backToLoginLink).toBeInTheDocument();

        fireEvent.click(backToLoginLink);

        expect(screen.getByRole('heading', { name: /Login Page/i })).toBeInTheDocument();
    });
});
