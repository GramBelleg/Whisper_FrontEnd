import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VerifyEmail from '@/components/auth/VerifyEmail/VerifyEmail';

describe('VerifyEmail Component', () => {
  const mockProps = {
    code: '',
    loading: false,
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    error: '',
    codeError: '',
    resendCode: vi.fn(),
    backToSignUp: vi.fn(),
    canResend: true,
    timer: 0,
  };

  it('renders correctly', () => {
    render(<VerifyEmail {...mockProps} />);
    expect(screen.getByText(/Account Verification/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter verification code/i)).toBeInTheDocument();
  });

  it('displays code error message', () => {
    const propsWithError = { ...mockProps, codeError: 'Verification code must be 8 digits' };
    render(<VerifyEmail {...propsWithError} />);
    expect(screen.getByText(/Verification code must be 8 digits/i)).toBeInTheDocument();
  });

  it('calls handleChange on input change', () => {
    render(<VerifyEmail {...mockProps} />);
    const input = screen.getByPlaceholderText(/Enter verification code/i);
    fireEvent.change(input, { target: { value: '12345678' } });
    expect(mockProps.handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit when Verify button is clicked', () => {
    render(<VerifyEmail {...mockProps} />);
    const button = screen.getByRole('button', { name: /Verify/i });
    fireEvent.click(button);
    expect(mockProps.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls resendCode when Resend verification code is clicked', () => {
    render(<VerifyEmail {...mockProps} />);
    const resendLink = screen.getByText(/Resend verification code/i);
    fireEvent.click(resendLink);
    expect(mockProps.resendCode).toHaveBeenCalledTimes(1);
  });

  it('disables resend link when canResend is false or loading', () => {
    const propsLoading = { ...mockProps, loading: true, canResend: false };
    render(<VerifyEmail {...propsLoading} />);
    const resendLink = screen.getByText(/Resend verification code/i);
    expect(resendLink).toHaveClass('opacity-50 cursor-not-allowed');
  });
});
