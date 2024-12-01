import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StickerMessage from '@/components/StickerMessage/StickerMessage';

describe('StickerMessage Component', () => {
  
  it('renders the sticker message correctly', () => {
    render(<StickerMessage messageState={0} />);
    
    // Check if the sticker message element is in the document
    const stickerMessageElement = screen.getByText('Sticker');
    expect(stickerMessageElement).toBeInTheDocument();
    
    // Check if the FontAwesomeIcon is rendered
    const stickerIcon = screen.getByRole('img', { hidden: true });
    expect(stickerIcon).toBeInTheDocument();
  });

  it('applies the "active" class when messageState is 2', () => {
    render(<StickerMessage messageState={2} />);
    
    // Check if the icon and text have the active class
    const stickerIcon = screen.getByRole('img', { hidden: true });
    const stickerText = screen.getByText('Sticker');

    expect(stickerIcon).toHaveClass('active');
    expect(stickerText).toHaveClass('active');
  });

  it('does not apply the "active" class when messageState is not 2', () => {
    render(<StickerMessage messageState={1} />);

    // Check if the icon and text do not have the active class
    const stickerIcon = screen.getByRole('img', { hidden: true });
    const stickerText = screen.getByText('Sticker');

    expect(stickerIcon).not.toHaveClass('active');
    expect(stickerText).not.toHaveClass('active');
  });
});
