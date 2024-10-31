import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextMessage from '@/components/TextMessage/TextMessage';

describe('TextMessage Component', () => {
  it('renders the message correctly', () => {
    const message = "Hello, this is a simple text message.";
    render(<TextMessage index={0} message={message} />);

    const textElement = screen.getByText(message);
    expect(textElement).toBeInTheDocument();
  });

  it('renders a trimmed message when it exceeds the maximum length', () => {
    const longMessage = "This message is definitely longer than the allowed maximum length of fifty-four characters.";
    const expectedTrimmedMessage = "This message is definitely longer than the allowed ..."; // Trimmed version

    render(<TextMessage index={0} message={longMessage} />);

    const textElement = screen.getByText(expectedTrimmedMessage);
    expect(textElement).toBeInTheDocument();
  });

  it('applies the "hovered" class when index is non-zero', () => {
    const message = "Hovered message test.";
    render(<TextMessage index={1} message={message} />);

    const textElement = screen.getByText(message);
    expect(textElement).toHaveClass('hovered');
  });

  it('does not apply the "hovered" class when index is zero', () => {
    const message = "Not hovered message test.";
    render(<TextMessage index={0} message={message} />);

    const textElement = screen.getByText(message);
    expect(textElement).not.toHaveClass('hovered');
  });
});
