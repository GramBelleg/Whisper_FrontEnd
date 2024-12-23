import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AllUsers from '../../src/components/AllUsers/AllUsers';
import { toggleUserBan } from '@/services/adminservice/adminActions';

const mockPop = vi.fn();
const mockSetReload = vi.fn();
const mockDbRef = {
  current: {
    updateUser: vi.fn(),
    banUser: vi.fn(),
    unBanUser: vi.fn(),
  },
};
vi.mock('@/services/adminservice/adminActions', () => ({
    toggleUserBan: vi.fn(),
  }));
  
vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
  useStackedNavigation: () => ({
    pop: mockPop,
  }),
}));

vi.mock('@/contexts/WhisperDBContext', () => ({
  useWhisperDB: () => ({
    dbRef: mockDbRef,
  }),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="mock-icon"></div>,
}));

describe('AllUsers Component', () => {
  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@example.com', profilePic: null, banned: false },
    { id: 2, name: 'User 2', email: 'user2@example.com', profilePic: null, banned: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks(); 
    toggleUserBan.mockResolvedValue(true); 
  });
  

  it('renders users correctly', () => {
    render(<AllUsers users={mockUsers} setReload={mockSetReload} />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('filters users based on search input', () => {
    render(<AllUsers users={mockUsers} setReload={mockSetReload} />);
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'User 1' } });
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();
  });

  it('handles context menu open and ban/unban actions', async () => {
    render(<AllUsers users={mockUsers} setReload={mockSetReload} />);
    
    const userItem = screen.getByText('User 1');
    fireEvent.contextMenu(userItem);

    const banButton = await screen.findByTestId('toggle-ban-button');
    expect(banButton).toBeInTheDocument();

    fireEvent.click(banButton);

    expect(mockDbRef.current.banUser).toHaveBeenCalledWith(1);


  });
  it('handles unban action', async () => {
    render(<AllUsers users={mockUsers} setReload={mockSetReload} />);
  
    const userItem = screen.getByText('User 1');
    fireEvent.contextMenu(userItem);
  
    const banButton = await screen.findByTestId('toggle-ban-button');
    expect(banButton).toBeInTheDocument();
    fireEvent.click(banButton);
  
    await waitFor(() => {
      expect(mockDbRef.current.banUser).toHaveBeenCalledWith(1);
    });
  
    fireEvent.contextMenu(userItem);
  
    const unBanButton = await screen.findByTestId('toggle-ban-button');
    expect(unBanButton).toBeInTheDocument();
    fireEvent.click(unBanButton);
  
    await waitFor(() => {
      expect(mockDbRef.current.unBanUser).toHaveBeenCalledWith(1);
    });
  });
  
});
