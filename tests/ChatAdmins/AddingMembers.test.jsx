import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChooseGroupMembers from '@/components/ChooseGroupMembers/ChooseGroupMembers';
import { getAllUsers } from '@/services/userservices/getAllUsers';
import '@testing-library/jest-dom';

vi.mock('@/services/userservices/getAllUsers', () => ({
  getAllUsers: vi.fn(),
}));

describe('ChooseGroupMembers Component', () => {
  const mockUsers = [
    { id: '1', userName: 'Alice', profilePic: '/path/to/alice.jpg' },
    { id: '2', userName: 'Bob', profilePic: '/path/to/bob.jpg' },
    { id: '3', userName: 'Charlie', profilePic: '/path/to/charlie.jpg' },
  ];

  beforeEach(() => {
    getAllUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the component and fetches users', async () => {
    render(
      <ChooseGroupMembers selectedUsers={[]} setSelectedUsers={vi.fn()} Users={[]} />
    );

    expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllUsers).toHaveBeenCalled();
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('filters users based on search term', async () => {
    render(
      <ChooseGroupMembers selectedUsers={[]} setSelectedUsers={vi.fn()} Users={[]} />
    );

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'Ali' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });
  test('handles checkbox selection and deselection', async () => {
    let selectedUsers = [];
    const mockSetSelectedUsers = vi.fn((updater) => {
      selectedUsers = typeof updater === 'function' ? updater(selectedUsers) : updater;
    });
  
    render(
      <ChooseGroupMembers
        selectedUsers={selectedUsers}
        setSelectedUsers={mockSetSelectedUsers}
        Users={[]}
      />
    );
  
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  
    const aliceCheckbox = screen.getByLabelText('Alice');
    fireEvent.click(aliceCheckbox);
  
    expect(selectedUsers).toEqual([
      { id: '1', userName: 'Alice', profilePic: '/path/to/alice.jpg' },
    ]);
  
    fireEvent.click(aliceCheckbox);
  
    expect(selectedUsers).toEqual([]);
  });
  

});
