import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalProvider } from '@/contexts/ModalContext';
import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext';
import { setBlockedStateForUser } from '@/services/blockedUsersService';
import useFetch from '@/services/useFetch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { blockedUsers as mockData } from '@/mocks/BlockedUsersData';
import BlockedUsers from '@/components/BlockedUsers/BlockedUsers';

vi.mock('@/services/blockedUsersService');
vi.mock('@/services/useFetch');

describe('BlockedUsers', () => {
  const mockBlockedUsers = mockData;

  beforeEach(() => {
    useFetch.mockReturnValue({
      data: mockBlockedUsers,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the list of blocked users', () => {
    render(
      <ModalProvider>
        <StackedNavigationProvider>
          <BlockedUsers />
        </StackedNavigationProvider>
      </ModalProvider>
    );

    expect(screen.getByText('Blocked Users')).toBeInTheDocument();
    expect(screen.getAllByTestId('user-item')).toHaveLength(mockBlockedUsers.length);
    expect(screen.getByAltText(mockBlockedUsers[0].userName)).toBeInTheDocument();
    expect(screen.getByAltText(mockBlockedUsers[1].userName)).toBeInTheDocument();
  });

  it('calls unblockUser when a user is confirmed to be unblocked', async () => {
    setBlockedStateForUser.mockResolvedValue();

    render(
      <ModalProvider>
        <StackedNavigationProvider>
          <BlockedUsers />
        </StackedNavigationProvider>
      </ModalProvider>
    );

    const userItem = screen.getAllByTestId('user-item')[0];
    fireEvent.click(userItem);

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to unblock this user?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('confirm-action-btn'));

    await waitFor(() => {
      expect(setBlockedStateForUser).toHaveBeenCalledWith(mockBlockedUsers[0].userId, false);
    });
  });

  it('opens the BlockUserModal when the add button is clicked', () => {
    render(
      <ModalProvider>
        <StackedNavigationProvider>
          <BlockedUsers />
        </StackedNavigationProvider>
      </ModalProvider>
    );

    const addButton = screen.getByTestId('add-blocked-user-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('block-user-modal')).toBeInTheDocument();
  });
});