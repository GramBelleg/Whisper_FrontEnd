import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeletedMessage from '@/components/DeletedMessage/DeletedMessage';

describe('DeletedMessage Component', () => {
  it('renders correctly when the sender is "You"', () => {
    render(<DeletedMessage sender="You" />); // Match the name with whoAmI.name

    const deletedMessage = screen.getByText(/deleted this message/i);
    expect(deletedMessage).toBeInTheDocument();
    expect(deletedMessage).toHaveTextContent('You deleted this message');
  });

  it('renders correctly when the sender is not "You"', () => {
    render(<DeletedMessage sender="AnotherUser" />); // Different sender

    const deletedMessage = screen.getByText(/deleted this message/i);
    expect(deletedMessage).toBeInTheDocument();
    expect(deletedMessage).toHaveTextContent('AnotherUser deleted this message');
  });
});
