import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from '@/components/auth/Logout/LogoutButton';
import LogoutModal from '@/components/auth/Logout/LogoutModal';
import { vi } from 'vitest';

vi.mock('@/components/auth/Logout/LogoutModal', () => ({
  default: ({ handleCancel }) => (
    <button onClick={handleCancel} data-testid="logout-cancel-btn">Cancel</button>
  ),
}));

describe('LogoutButton', () => {
  it('should render the logout icon', () => {
    render(<LogoutButton />);
    const logoutIcon = screen.getByTestId('logout-icon');
    expect(logoutIcon).toBeInTheDocument();
  });

  it('should open the modal on logout icon click', () => {
    render(<LogoutButton />);
    const logoutIcon = screen.getByTestId('logout-icon');
    fireEvent.click(logoutIcon);
    const cancelButton = screen.getByTestId('logout-cancel-btn');
    expect(cancelButton).toBeInTheDocument();
  });

  it('should close the modal on cancel', () => {
    render(<LogoutButton />);
    const logoutIcon = screen.getByTestId('logout-icon');
    fireEvent.click(logoutIcon);
    const cancelButton = screen.getByTestId('logout-cancel-btn');
    fireEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
  });
});
