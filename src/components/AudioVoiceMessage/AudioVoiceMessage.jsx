import "./AudioVoiceMessage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from  '@fortawesome/free-solid-svg-icons';

import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { formatDuration } from '@/utils/formatDuration';
import { readMedia } from "@/services/chatservice/media";

const AudioVoiceMessage = ({blobName}) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const loadAudio = async () => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#af97f3',
        progressColor: '#ffffff',
        cursorColor: '#ffffff',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 28,
        width: 190,
        barGap: 2,
      });

      const audioUrl = await readMedia(blobName);

      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on('decode', (duration) => {
        setDuration(Math.floor(duration));
      });

      wavesurfer.current.on('audioprocess', () => {
        if (wavesurfer.current) {
          setCurrentTime(Math.floor(wavesurfer.current.getCurrentTime()));
        }
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }
  useEffect(() => {
    loadAudio();
  }, []);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={togglePlayPause}
        className="play-pause-button"
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} height={28} />
      </button>
      <div className='flex flex-col gap-2 flex-grow'>
        <div className="flex-grow">
          <div ref={waveformRef} className="w-full waveform" />
        </div>
        <div className="text-sm font-medium self-start">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
};


export default AudioVoiceMessage;