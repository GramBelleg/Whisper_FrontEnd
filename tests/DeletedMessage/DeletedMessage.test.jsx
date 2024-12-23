import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeletedMessage from '@/components/DeletedMessage/DeletedMessage';

vi.mock('@/hooks/useAuth', () => ({
  default: () => ({
    user: { name: 'CurrentUser' }, 
  }),
}));

describe('DeletedMessage Component', () => {
  it('renders correctly when the sender is "You"', () => {
    render(<DeletedMessage sender="CurrentUser" />); 

    const deletedMessage = screen.getByText(/deleted this message/i);
    expect(deletedMessage).toBeInTheDocument();
    expect(deletedMessage).toHaveTextContent('You deleted this message');
  });

  it('renders correctly when the sender is not "You"', () => {
    render(<DeletedMessage sender="AnotherUser" />); // Sender does not match the mocked user

    const deletedMessage = screen.getByText(/deleted this message/i);
    expect(deletedMessage).toBeInTheDocument();
    expect(deletedMessage).toHaveTextContent('AnotherUser deleted this message');
  });
});
