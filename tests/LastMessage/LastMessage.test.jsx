// LastMessage.test.jsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LastMessage from '@/components/LastMessage/LastMessage';


describe('LastMessage Component', () => {
  
  it('renders a text message', () => {
    render(<LastMessage sender="User" messageType="text" message="Hello" messageState={0} index={1} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders an image message', () => {
    render(<LastMessage sender="User" messageType="image" message="" messageState={0} index={1} />);
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('renders an audio message', () => {
    render(<LastMessage sender="User" messageType="audio" message="test-audio.mp3" messageState={0} index={1} />);
    expect(document.querySelector('.audio-message')).toBeInTheDocument();
  });

  it('renders a voice note message', () => {
    render(<LastMessage sender="User" messageType="voiceNote" message="test-audio.mp3" messageState={0} index={1} />);
    expect(document.querySelector('.voice-note-message')).toBeInTheDocument();
  });

  it('renders a video message', () => {
    render(<LastMessage sender="User" messageType="video" message="" messageState={0} index={1} />);
    expect(document.querySelector('.video-message')).toBeInTheDocument();
  });

  it('renders a sticker message', () => {
    render(<LastMessage sender="User" messageType="sticker" message="" messageState={0} index={1} />);
    expect(document.querySelector('.sticker-message')).toBeInTheDocument();
  });

  it('renders a deleted message', () => {
    render(<LastMessage sender="User" messageType="text" message="" messageState={3} index={1} />);
    expect(screen.getByText('User deleted this message')).toBeInTheDocument();
  });
});
