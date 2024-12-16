import React, { useEffect, useState } from 'react';
import {
  RemoteUser,
  LocalAudioTrack,
  useLocalMicrophoneTrack,
  RemoteAudioTrack
} from 'agora-rtc-react';
import useVoiceCall from '@/hooks/useVoiceCall';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneAlt, faMicrophoneAltSlash, faPhoneSlash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './VoiceCallHeader.css';
const VoiceCallHeader = () => {

  const {
    localVolume,
    remoteVolumes,
    remoteUsers,
    channel,
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

  useEffect(() => {
    console.log('Remote users:', remoteUsers);
    remoteUsers.forEach((user) => {
    console.log(`User ${user.uid} audio track:`, user.audioTrack);
    });
  }, [remoteUsers]);
  
    return (
      <div className="voice-call-header">
        <div className="call-controls">
              <button onClick={toggleMute}>
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
                  step={1}
                  value={localVolume}
                  onChange={(e) => adjustLocalVolume(e.target.value)}
                />
              </div>
            </div>
            <div className="participants">
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
                                type="range"
                                min="0"
                                max="100"
                                step={1}
                                value={remoteVolumes[user.uid]}
                                onChange={(e) => {
                                    adjustRemoteVolume(user.uid, e.target.value)}}
                            />
                          </> : (
                            <span>User muted his voice</span>
                          )}
                        </div>
                      ))
                }
            </>
        )}
        </div>

        <button onClick={() => {endCall()}}>
            <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
      
      </div>
    );
  };
  
  export default VoiceCallHeader;
  