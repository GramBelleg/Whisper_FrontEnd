import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, afterEach, expect } from 'vitest';
import ResetPasswordContainer from '@/components/auth/ResetPassword/ResetPasswordContainer';
import AuthContext from '@/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';


const mockHandleClose = vi.fn();
const mockHandleReset = vi.fn().mockResolvedValue({ success: true });

const defaultAuthContextValue = {
    handleReset: mockHandleReset,
    loading: false,
    error: ''
};

describe('ResetPasswordContainer', () => {
  afterEach(()=>
  {
    cleanup();
    mockHandleReset.mockClear();
  }
  );

  const renderResetPasswordContainer = ( contextValue = {} ) => {
    return render(
        <MemoryRouter>
                <AuthContext.Provider value={{ ...defaultAuthContextValue, ...contextValue }}>
                    <ResetPasswordContainer email='test@example.com' handleClose={mockHandleClose} />
                </AuthContext.Provider>
        </MemoryRouter>
    );
  };
  const fillForm = (password, confirmPassword, resetCode) => {
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: confirmPassword } });
    fireEvent.change(screen.getByPlaceholderText('Reset Code'), { target: { value: resetCode } });
  };
  const submitForm = () => {
    fireEvent.click(screen.getByTestId('reset-password-btn'));
  };

  test('renders ResetPassword form correctly', () => {
    renderResetPasswordContainer();

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Reset Code')).toBeInTheDocument();
  });

  it('submits form with correct values and calls handleReset', async () => {
    renderResetPasswordContainer();
    
    fillForm('NewPassword123', 'NewPassword123', '123456788');
    submitForm();
    
    waitFor(() => {
    expect(mockHandleReset).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'NewPassword123',
      confirmPassword: 'NewPassword123',
      code: '123456788'
    });

    });
  });
  it('displays success alert when password reset is successful', async () => {
    renderResetPasswordContainer();

    fillForm('NewPassword123', 'NewPassword123', '123456788');
    submitForm();

    waitFor(() => {
    expect(screen.getByText(/Password reset successfully/i)).toBeInTheDocument();
    });
  });

  it('displays validation errors when submitting empty form', async () => {
    renderResetPasswordContainer();

    const submitButton = screen.getByTestId('reset-password-btn');
    fireEvent.click(submitButton);

      waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Confirm Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Code is required/i)).toBeInTheDocument();
    });
  });
  it('displays validation errors when password is less than 8 characters', async () => {
    renderResetPasswordContainer();
    fillForm('NewPass', 'NewPass', '123456');
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });
  });
  it('displays validation errors when password and confirm password do not match', async () => {
    renderResetPasswordContainer();
    fillForm('NewPassword', 'NewPassword2', '123456');
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
  });
  });

  it('displays error message from auth context', async () => {
    const mockAuthContextErrorValue = {
      ...defaultAuthContextValue,
      error: 'Invalid reset attempt'
    };

    renderResetPasswordContainer(mockAuthContextErrorValue);

    fillForm('NewPassword123', 'NewPassword123', '123456788');
    submitForm();

    expect(screen.getByText(/invalid reset attempt/i)).toBeInTheDocument();
  });

});
