import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VerifyEmailContainer from '@/components/auth/VerifyEmail/VerifyEmailConatiner';
import useAuth from '@/hooks/useAuth';
import useResendTimer from '@/hooks/useResendTimer';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useResendTimer');

describe('VerifyEmailContainer Component', () => {
  const mockHandleVerify = vi.fn();
  const mockHandleResendCode = vi.fn();
  const mockHandleBackToSignUp = vi.fn();
  const mockResetTimer = vi.fn();
  
  beforeEach(() => {
    useAuth.mockReturnValue({
      handleVerify: mockHandleVerify,
      handleResendCode: mockHandleResendCode,
      handleBackToSignUp: mockHandleBackToSignUp,
      loading: false,
      error: '',
    });
    
    useResendTimer.mockReturnValue({
      timer: 0,
      canResend: true,
      resetTimer: mockResetTimer,
    });
  });

  it('renders correctly', () => {
    render(<VerifyEmailContainer />);
    expect(screen.getByText(/Account Verification/i)).toBeInTheDocument();
  });

  it('calls handleVerify on form submit', async () => {
    mockHandleVerify.mockResolvedValue({ success: true });

    render(<VerifyEmailContainer />);
    const input = screen.getByPlaceholderText(/Enter verification code/i);
    const button = screen.getByRole('button', { name: /Verify/i });
    
    fireEvent.change(input, { target: { value: '12345678' } });
    fireEvent.click(button);

    expect(mockHandleVerify).toHaveBeenCalledWith('12345678');
    expect(sessionStorage.getItem("lastVerifyTime")).toBeNull();
});


  it('handles code input change', () => {
    render(<VerifyEmailContainer />);
    const input = screen.getByPlaceholderText(/Enter verification code/i);
    
    fireEvent.change(input, { target: { value: '87654321' } });
    expect(screen.getByPlaceholderText(/Enter verification code/i).value).toBe('87654321');
  });

  it('calls resendCode when Resend verification code is clicked', () => {
    render(<VerifyEmailContainer />);
    const resendLink = screen.getByText(/Resend verification code/i);
    fireEvent.click(resendLink);
    expect(mockHandleResendCode).toHaveBeenCalledTimes(1);
  });

  it('calls handleBackToSignUp when Back To Sign Up is clicked', () => {
    render(<VerifyEmailContainer />);
    const backLink = screen.getByText(/Back To Sign Up/i);
    fireEvent.click(backLink);
    expect(mockHandleBackToSignUp).toHaveBeenCalledTimes(1);
  });
});
