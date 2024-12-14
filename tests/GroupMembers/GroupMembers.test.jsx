import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GroupMembers from '@/components/GroupMembers/GroupMembers';
import noUser from '@/assets/images/no-user.png';

const mockMembers = [
  { id: 1, userName: 'John Doe', profilePic: 'https://example.com/john.jpg' },
  { id: 2, userName: 'Jane Smith', profilePic: '' },
  { id: 3, userName: '', profilePic: '' },
];

describe('GroupMembers Component', () => {
  it('renders correctly with group members', () => {
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
      />
    );

    expect(screen.getByText('Group Members')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Unknown User')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'https://example.com/john.jpg');
    expect(images[1]).toHaveAttribute('src', noUser);
    expect(images[2]).toHaveAttribute('src', noUser);
  });

  it('calls handleQueryChange when typing in the search bar', () => {
    const handleQueryChange = vi.fn();

    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={handleQueryChange}
      />
    );

    const searchInput = screen.getByTestId("search-input-test")
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(handleQueryChange).toHaveBeenCalledTimes(1);
  });

  it('displays no members when filteredMembers is empty', () => {
    render(
      <GroupMembers
        filteredMembers={[]}
        handleQueryChange={() => {}}
      />
    );

    const membersList = screen.getByText('Group Members');
    expect(membersList).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
