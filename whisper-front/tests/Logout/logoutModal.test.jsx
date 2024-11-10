import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutModal from '@/components/auth/Logout/LogoutModal';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth', () => ({
  default: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('LogoutModal', () => {
  const mockHandleLogout = vi.fn();
  const mockNavigate = vi.fn();
  const mockHandleCancel = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      handleLogout: mockHandleLogout,
      error: null,
      loading: false,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render the logout confirmation modal', () => {
    render(<LogoutModal handleCancel={mockHandleCancel} />);
    expect(screen.getByText(/Are you sure you want to log out\?/)).toBeInTheDocument();
  });

  it('should call handleCancel when cancel button is clicked', () => {
    render(<LogoutModal handleCancel={mockHandleCancel} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it('should call handleLogout when logout button is clicked', async () => {
    mockHandleLogout.mockResolvedValue({ success: true });
    render(<LogoutModal handleCancel={mockHandleCancel} />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockHandleLogout).toHaveBeenCalled();
    });
  });

  it('should navigate to /login on successful logout', async () => {
    mockHandleLogout.mockResolvedValue({ success: true });
    render(<LogoutModal handleCancel={mockHandleCancel} />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display an error message on failed logout', async () => {
    const errorMessage = 'Logout failed';
    mockHandleLogout.mockResolvedValue({ success: false });
    useAuth.mockReturnValue({
      handleLogout: mockHandleLogout,
      error: errorMessage,
      loading: false,
    });

    render(<LogoutModal handleCancel={mockHandleCancel} />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
