import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminSettings from '../../src/components/AdminSettings/AdminSettings';

const mockGetUsersAdminStore = vi.fn();
const mockGetGroups = vi.fn();
const mockOpenModal = vi.fn();
const mockCloseModal = vi.fn();
const mockPush = vi.fn();

const mockUseModal = vi.fn();


vi.mock('../../src/contexts/ModalContext', () => ({
  useModal: () => mockUseModal()
}));

vi.mock('@/contexts/WhisperDBContext', () => ({
  useWhisperDB: () => ({
    dbRef: {
      current: {
        getUsersAdminStore: mockGetUsersAdminStore,
        getGroups: mockGetGroups
      }
    }
  })
}));

vi.mock('@/hooks/useAuth', () => ({
  default: () => ({
    user: {
      id: '1',
      autoDownloadSize: 12
    }
  })
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
  useStackedNavigation: () => ({
    push: mockPush,
    pop: vi.fn(),
    stack: []
  })
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="mock-icon"></div>
}));

describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup modal mock
    mockUseModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    });

    mockGetUsersAdminStore.mockResolvedValue([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ]);
    mockGetGroups.mockResolvedValue([
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' }
    ]);
  });

  it('renders loading state initially', () => {
    render(<AdminSettings />);
    expect(screen.getByTestId('test-admin-page')).toHaveClass('admin loading');
  });

  it('renders users and groups count after loading', async () => {
    render(<AdminSettings />);
    await screen.findByText(/Admin Dashboard/i);
    expect(mockGetUsersAdminStore).toHaveBeenCalled();
    expect(mockGetGroups).toHaveBeenCalled();
    expect(screen.getByText('Users (2)')).toBeInTheDocument();
    expect(screen.getByText('Groups (2)')).toBeInTheDocument();
  });

  it('triggers navigation when clicking users section', async () => {
    render(<AdminSettings />);
    await screen.findByText(/Admin Dashboard/i);
    fireEvent.click(screen.getByTestId('all-users-icon'));
    expect(mockPush).toHaveBeenCalled();
  });

  it('handles error state correctly', async () => {
    mockGetUsersAdminStore.mockRejectedValueOnce(new Error('Failed to load'));
    
    render(<AdminSettings />);
    
    await vi.waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalled();
    });
  });

});