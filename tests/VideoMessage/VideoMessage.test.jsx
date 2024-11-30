import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VideoMessage from '@/components/VideoMessage/VideoMessage';

describe('VideoMessage Component', () => {
  
  it('renders the video message correctly', () => {
    render(<VideoMessage messageState={0} />);
    
    // Check if the video message element is in the document
    const videoMessageElement = screen.getByText('Video');
    expect(videoMessageElement).toBeInTheDocument();
    
    // Check if the FontAwesomeIcon is rendered
    const videoIcon = screen.getByRole('img', { hidden: true });
    expect(videoIcon).toBeInTheDocument();
  });

  it('applies the "active" class when messageState is 2', () => {
    render(<VideoMessage messageState={2} />);
    
    // Check if the icon and text have the active class
    const videoIcon = screen.getByRole('img', { hidden: true });
    const videoText = screen.getByText('Video');

    expect(videoIcon).toHaveClass('active');
    expect(videoText).toHaveClass('active');
  });

  it('does not apply the "active" class when messageState is not 2', () => {
    render(<VideoMessage messageState={1} />);

    // Check if the icon and text do not have the active class
    const videoIcon = screen.getByRole('img', { hidden: true });
    const videoText = screen.getByText('Video');

    expect(videoIcon).not.toHaveClass('active');
    expect(videoText).not.toHaveClass('active');
  });
});
