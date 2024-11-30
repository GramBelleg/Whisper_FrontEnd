import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import AudioVoiceNoteMessage from '@/components/AudioVoiceNoteMessage/AudioVoiceNoteMessage';

describe('AudioVoiceNoteMessage Component', () => {
  const mockAudioSrc = 'test-audio.mp3'; // Mock audio source

  beforeEach(() => {
    // Mock the audio duration
    Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
      writable: true,
      value: 10, // Set a mock duration for testing
    });
  });

  it('renders the audio message correctly', () => {
    render(<AudioVoiceNoteMessage messageType="audio" messageState={0} message={mockAudioSrc} />);

    const audioElement = document.querySelector('.audio-message');
    const micIcon = document.querySelector('.mic-icon');
    expect(audioElement).toBeInTheDocument();
    expect(micIcon).toBeInTheDocument();
  });

  it('displays the audio duration when metadata is loaded', async () => {
    render(<AudioVoiceNoteMessage messageType="audio" messageState={0} message={mockAudioSrc} />);

    const audioElement = document.querySelector('.audio-message');
    
    // Simulate loading metadata
    fireEvent.loadedMetadata(audioElement);

    const durationElement = await screen.findByText('10.0s');
    expect(durationElement).toBeInTheDocument();
  });

  it('applies the "active" class when messageState is 2', () => {
    render(<AudioVoiceNoteMessage messageType="audio" messageState={2} message={mockAudioSrc} />);

    const micIcon = document.querySelector('.mic-icon');
    const durationElement = screen.getByText('10.0s');
    
    expect(micIcon).toHaveClass('active');
    expect(durationElement).toHaveClass('active');
  });

  it('does not apply the "active" class when messageState is not 2', () => {
    render(<AudioVoiceNoteMessage messageType="audio" messageState={1} message={mockAudioSrc} />);

    const micIcon = document.querySelector('.mic-icon'); // FontAwesomeIcon is treated as an img
    const durationElement = screen.getByText('10.0s');
    
    expect(micIcon).not.toHaveClass('active');
    expect(durationElement).not.toHaveClass('active');
  });

  it('renders the voice note message correctly', () => {
    render(<AudioVoiceNoteMessage messageType="voiceNote" messageState={0} message={mockAudioSrc} />);

    const audioElement = document.querySelector('.voice-note-message');
    expect(audioElement).toBeInTheDocument();
  });

  it('renders the audio message correctly', () => {
    render(<AudioVoiceNoteMessage messageType="audio" messageState={0} message={mockAudioSrc} />);

    const audioElement = document.querySelector('.audio-message');
    expect(audioElement).toBeInTheDocument();
  });
});
