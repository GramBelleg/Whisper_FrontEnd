import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import useVoiceCall from '@/hooks/useVoiceCall';
import { useLocalMicrophoneTrack } from 'agora-rtc-react';
import VoiceCallHeader from '@/components/VoiceCall/VoiceCallHeader';

// Mock the hooks
vi.mock('@/hooks/useVoiceCall');
vi.mock('agora-rtc-react');

describe('VoiceCallHeader', () => {
  const mockToggleMute = vi.fn();
  const mockAdjustLocalVolume = vi.fn();
  const mockAdjustRemoteVolume = vi.fn();
  const mockEndCall = vi.fn();
  
  const defaultMockProps = {
    localVolume: 50,
    remoteVolumes: { 'user1': 75 },
    remoteUsers: [],
    channel: 'test-channel',
    isMuted: false,
    isConnected: true,
    isJoiningCall: false,
    adjustLocalVolume: mockAdjustLocalVolume,
    adjustRemoteVolume: mockAdjustRemoteVolume,
    toggleMute: mockToggleMute,
    usersInfo: {},
    endCall: mockEndCall,
    localMicrophoneTrack: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useVoiceCall.mockReturnValue(defaultMockProps);
    useLocalMicrophoneTrack.mockReturnValue([null, false]);
  });

  it('renders without crashing', () => {
    render(<VoiceCallHeader />);
    expect(screen.getByTestId('toggleMute')).toBeInTheDocument();
  });

  it('displays "Joining..." when isJoiningCall is true', () => {
    useVoiceCall.mockReturnValue({
      ...defaultMockProps,
      isConnected: false,
      isJoiningCall: true
    });
    render(<VoiceCallHeader />);
    expect(screen.getByText('Joining...')).toBeInTheDocument();
  });

  it('displays "Ringing..." when connected but no remote users', () => {
    useVoiceCall.mockReturnValue({
      ...defaultMockProps,
      isConnected: true,
      remoteUsers: []
    });
    render(<VoiceCallHeader />);
    expect(screen.getByText('Ringing...')).toBeInTheDocument();
  });

  it('handles mute toggle correctly', () => {
    render(<VoiceCallHeader />);
    const muteButton = screen.getByTestId('toggleMute');
    fireEvent.click(muteButton);
    expect(mockToggleMute).toHaveBeenCalled();
  });

  it('handles local volume adjustment', () => {
    render(<VoiceCallHeader />);
    const volumeSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(volumeSlider, { target: { value: '75' } });
    expect(mockAdjustLocalVolume).toHaveBeenCalledWith('75');
  });

  it('displays remote users when present', () => {
    const mockRemoteUsers = [{
      uid: 'user1',
      audioTrack: { play: vi.fn() }
    }];
    const mockUsersInfo = {
      user1: { name: 'Test User' }
    };

    useVoiceCall.mockReturnValue({
      ...defaultMockProps,
      remoteUsers: mockRemoteUsers,
      usersInfo: mockUsersInfo
    });

    render(<VoiceCallHeader />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows muted status for remote user when audioTrack is null', () => {
    const mockRemoteUsers = [{
      uid: 'user1',
      audioTrack: null
    }];

    useVoiceCall.mockReturnValue({
      ...defaultMockProps,
      remoteUsers: mockRemoteUsers
    });

    render(<VoiceCallHeader />);
    expect(screen.getByText('User muted his voice')).toBeInTheDocument();
  });

  it('handles remote volume adjustment', () => {
    const mockRemoteUsers = [{
      uid: 'user1',
      audioTrack: { play: vi.fn() }
    }];

    useVoiceCall.mockReturnValue({
      ...defaultMockProps,
      remoteUsers: mockRemoteUsers,
      remoteVolumes: { user1: 50 }
    });

    render(<VoiceCallHeader />);
    const remoteVolumeSlider = screen.getAllByRole('slider')[1];
    fireEvent.change(remoteVolumeSlider, { target: { value: '80' } });
    expect(mockAdjustRemoteVolume).toHaveBeenCalledWith('user1', '80');
  });

  it('handles end call', () => {
    render(<VoiceCallHeader />);
    const endCallButton = screen.getAllByRole('button')[1];
    fireEvent.click(endCallButton);
    expect(mockEndCall).toHaveBeenCalled();
  });
});