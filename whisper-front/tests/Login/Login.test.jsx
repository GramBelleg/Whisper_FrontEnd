import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LoginContainer from '@/components/auth/Login/LoginContainer';
import { vi, describe, beforeEach, afterEach, expect, test } from 'vitest';
import AuthContext from '@/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('LoginContainer', () => {
    const mockedNavigate = vi.fn();
    const mockHandleLogin = vi.fn();
    const mockedClearError = vi.fn();

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(mockedNavigate);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    const renderLoginContainer = (contextValue = {}) => {
        return render(
            <MemoryRouter>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
                    <AuthContext.Provider value={{ ...defaultAuthContextValue, ...contextValue }}>
                        <LoginContainer />
                    </AuthContext.Provider>
                </GoogleOAuthProvider>
            </MemoryRouter>
        );
    };

    const fillLoginForm = async (email = 'test@test.com', password = 'Hana1234') => {
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: email } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: password } });
    };

    const defaultAuthContextValue = {
        handleLogin: mockHandleLogin,
        clearError: mockedClearError,
        loading: false,
        error: '',
    };

    test('successful login triggers handleLogin and navigation', async () => {
        mockHandleLogin.mockResolvedValueOnce({ success: true });
        renderLoginContainer();

        await fillLoginForm();
        fireEvent.click(await screen.findByTestId('login-btn'));

        await waitFor(() => {
            expect(mockHandleLogin).toHaveBeenCalled();
            expect(mockedNavigate).toHaveBeenCalledWith('/chats');
        });
    });

    test('shows validation error returned from the context', async () => {
        renderLoginContainer();

        await fillLoginForm('invalid-email');
        fireEvent.click(await screen.findByTestId('login-btn'));

        expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    });

    test('shows validation errors on empty form submission', async () => {
        renderLoginContainer();

        fireEvent.click(await screen.findByTestId('login-btn'));

        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    test('displays error message on failed login attempt', async () => {
        const errorMessage = 'Invalid email or password';
        renderLoginContainer({ error: errorMessage });

        await fillLoginForm();
        fireEvent.click(await screen.findByTestId('login-btn'));

        expect(await screen.findByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });
});
