import { render, screen, fireEvent } from '@testing-library/react';
import GoogleButton from '@/components/common/GoogleButton';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { vi } from 'vitest';
import useAuth from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
    default: vi.fn()
}));

vi.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    useGoogleLogin: vi.fn(),
}));

describe('GoogleButton Component', () => {
    const mockHandleGoogleSignUp = vi.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({
            handleGoogleSignUp: mockHandleGoogleSignUp,
            loading: false,
            error: null,
            clearError: vi.fn()
        });
        useGoogleLogin.mockReturnValue(mockHandleGoogleSignUp);
    });

    it('renders Google button and triggers login on click', () => {
        render(
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <GoogleButton />
            </GoogleOAuthProvider>
        );

        const button = screen.getByText('Sign In With Google');
        fireEvent.click(button);
        expect(mockHandleGoogleSignUp).toHaveBeenCalled();
    });
});
