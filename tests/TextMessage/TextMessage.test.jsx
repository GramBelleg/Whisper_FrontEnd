import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextMessage from '@/components/TextMessage/TextMessage';

describe('TextMessage Component', () => {
  it('renders the message correctly', () => {
    const message = "Hello, this is a simple text message.";
    render(<TextMessage message={message} />);

    const textElement = screen.getByText(message);
    expect(textElement).toBeInTheDocument();
  });
});
