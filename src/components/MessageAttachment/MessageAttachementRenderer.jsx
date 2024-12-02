import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../../services/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPlay, faPause, faVolumeUp, faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import { downloadAttachment } from './fileServices';
import { whoAmI } from '../../services/chatservice/whoAmI';
import { readMedia } from '@/services/chatservice/media'
import { useChat } from '@/contexts/ChatContext';
import { useWhisperDB } from '@/contexts/WhisperDBContext';
const MessageAttachmentRenderer = ({ myMessage }) => {
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [autoDownload, setAutoDownload] = useState(false);
    const [ objectUrl, setAttachmentUrl ] = useState(null);
    const { dbRef } = useWhisperDB();
    useEffect(() => {
      setAutoDownload(false);
      setAttachmentUrl(null);
      setIsLoading(true);
      setError(null);
    }, [myMessage.time]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log(objectUrl);
          if (myMessage.objectLink) {
            console.log('Using existing objectLink:', myMessage.objectLink);
            setAttachmentUrl(myMessage.objectLink);
            setAutoDownload(true);
            setIsLoading(false);
            return;
          }
          console.log(myMessage);
          // If file type is not 0, handle size check and download
          if (parseInt(myMessage.attachmentType) !== 0 && !autoDownload) {
            const fileSize = myMessage.size;
            console.log(fileSize);
            if (fileSize < whoAmI.autoDownloadSize) {
              let presignedUrl = await readMedia(myMessage.media);
              const newObjectUrl = await downloadAttachment(presignedUrl, myMessage);
              setAttachmentUrl(newObjectUrl);
              await dbRef.current.updateMessage(myMessage.id, { 
                objectLink: newObjectUrl,
            });
              setIsLoading(false);
              setAutoDownload(true);
              setIsLoading(false);
            } else {
              setAutoDownload(false);
              setIsLoading(false);
            }
          } else {
            let presignedUrl = await readMedia(myMessage.media);
            const newObjectUrl = await downloadAttachment(presignedUrl, myMessage);
            setAutoDownload(true);
            setAttachmentUrl(newObjectUrl);
            await dbRef.current.updateMessage(myMessage.id, { 
              objectLink: newObjectUrl,
          });

            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError("Error fetching attachment data.");
          setIsLoading(false);
        }
      };
    
      if (myMessage && isLoading) {
        fetchData();
      }
      
    }, [myMessage, autoDownload, isLoading]); // may add objectUrl to dependencies
    useEffect(() => {
    }, [dbRef]);// may add objectUrl to dependencies
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const renderAttachment = () => {
    const fileType = myMessage.extension;

    if (!myMessage.media) return <p>No attachment available</p>;
    if (isLoading) {
      return (
        <div>
          <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
        </div>
      );
    }

    if (!autoDownload)
      return <FontAwesomeIcon 
        icon={faCircleArrowDown} 
        size="2x" 
        style={{ cursor: 'pointer' }} 
        onClick={() => {
          setIsLoading(true);
          setAutoDownload(true);
        }}
        data-testid="render-button"
      />
    
    if (!objectUrl) return <p>no url found attachment</p>;

    // Audio
    if (parseInt(myMessage.attachmentType) === 2) {
      return (
        <div className="audio-player bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <audio
            ref={audioRef}
            src={objectUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            data-testid="audio-viewer"
          />
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={handleAudioPlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
              data-testid="audio-play-button"
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <div className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faVolumeUp} className="text-gray-500" />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              data-testid="seek-bar"
            />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {myMessage.attachmentName}
          </div>
        </div>
      );
    }
    
    if (parseInt(myMessage.attachmentType) === 0 || (fileType && ((!fileType.startsWith("image/") && !fileType.startsWith("video/"))))) {
      return (
        <a href={objectUrl} download={myMessage.attachmentName} className="file-attachment" data-testid="download-link">
          {myMessage.attachmentName}
        </a>
      );
    }

    if (fileType.startsWith("image/")) {
      return (
        <img
          key={`${myMessage.id}-${objectUrl}`}
          src={objectUrl}
          alt="attachment"
          className="message-image"
          onError={() => setError("Failed to load image")}
          data-testid="image-viewer"
        />
      );
    }

    if (fileType.startsWith("video/")) {
      return (
        <video
          key={`${myMessage.id}-${objectUrl}`}
          ref={videoRef}
          controls
          className="message-video"
          onError={handleVideoError}
          data-testid="video-viewer"
        >
          <source 
            src={objectUrl} 
            type={fileType}
            onError={(e) => {
              console.log("Source error:", e);
              handleVideoError(e);
            }}
          />
          Your browser does not support this video format.
        </video>
      );
    }
  };

  const handleVideoError = (e) => {
    const videoElement = e.target.tagName === 'SOURCE' ? e.target.parentElement : e.target;
    const videoError = videoElement.error;
    
    if (videoError) {
      const errorMessages = {
        [MediaError.MEDIA_ERR_ABORTED]: "Video loading was aborted",
        [MediaError.MEDIA_ERR_NETWORK]: "Network error while loading video",
        [MediaError.MEDIA_ERR_DECODE]: "Video decode failed - file might be corrupted",
        [MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED]: "Video format or type not supported"
      };
      setError(errorMessages[videoError.code] || `Video error: ${videoError.message || "Unknown error"}`);
    } else if (!objectUrl) {
      setError("No video source available");
    } else {
      setError("Failed to load video: Unknown error occurred");
    }
  };

  if (error) {
    return (
      <div>
        <p>Error loading attachment: {error}</p>
        {renderAttachment()}
      </div>
    );
  }
  
  return (
    <div className="attachment-container">
      {renderAttachment()}
    </div>
  );
};

export default MessageAttachmentRenderer;