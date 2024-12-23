import React from 'react';
import {
  RemoteUser,
  LocalAudioTrack,
} from 'agora-rtc-react';
import useVoiceCall from '@/hooks/useVoiceCall';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneAlt, faMicrophoneAltSlash, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
import './VoiceCallHeader.css';
const VoiceCallHeader = () => {

  const {
    localVolume,
    remoteVolumes,
    remoteUsers,
    isMuted,
    isConnected,
    isJoiningCall,
    adjustLocalVolume,
    adjustRemoteVolume,
    toggleMute,
    usersInfo,
    endCall,
    localMicrophoneTrack
  } = useVoiceCall();
  
    return (
      <div className="voice-call-header">
        <div className="call-controls">
              <button data-testid="toggleMute" onClick={toggleMute}>
                <FontAwesomeIcon icon={isMuted ? faMicrophoneAltSlash : faMicrophoneAlt} style={{color:isMuted ? 'red' : 'black'}} />
                </button>
              <div className="volume-control">
                <label>
                    <FontAwesomeIcon icon={faMicrophone} />
                </label>
                <LocalAudioTrack track={localMicrophoneTrack} play={false} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  data-testid="localVolume"
                  step={1}
                  value={localVolume}
                  onChange={(e) => adjustLocalVolume(e.target.value)}
                />
              </div>
            </div>
            <div data-testid="joinedUsers" className="participants">
        {!isConnected ? (isJoiningCall ? 'Joining...' : 'Joined') : (
            <>
                {remoteUsers.length === 0 && <h3>Ringing...</h3>}
                {remoteUsers.map((user) => (
                        <div key={user.uid} className="remote-user">
                          <h4>{usersInfo[user.uid]?.name || ""}</h4>
                          <RemoteUser user={user} />
                          {user.audioTrack ? <>
                            <label>Volume</label>
                            <input
                                data-testid="remoteVolumes"
                                type="range"
                                min="0"
                                max="100"
                                step={1}
                                value={remoteVolumes[user.uid]}
                                onChange={(e) => {
                                    adjustRemoteVolume(user.uid, e.target.value)}}
                            />
                          </> : (
                            <span data-testid="muted">User muted his voice</span>
                          )}
                        </div>
                      ))
                }
            </>
        )}
        </div>

        <button data-testid="endCall" onClick={() => {endCall()}}>
            <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
      
      </div>
    );
  };
  
  export default VoiceCallHeader;
  