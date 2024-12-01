import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImageMessage from '@/components/ImageMessage/ImageMessage';

describe('ImageMessage Component', () => {
  it('renders the image message correctly', () => {
    render(<ImageMessage messageState={0} />);

    const iconElement = document.querySelector('.image-icon'); // Assuming FontAwesomeIcon is recognized as an img
    const textElement = screen.getByText('Image');
    
    expect(iconElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });

  it('applies the "active" class when messageState is 2', () => {
    render(<ImageMessage messageState={2} />);

    const iconElement = screen.getByText('Image');
    
    expect(iconElement).toHaveClass('active');
  });

  it('does not apply the "active" class when messageState is not 2', () => {
    render(<ImageMessage messageState={1} />);

    const iconElement = screen.getByText('Image');
    
    expect(iconElement).not.toHaveClass('active');
  });
});
