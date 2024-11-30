import { useState, useEffect, useRef } from 'react';
import useFetch from '../../services/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const MessageAttachmentRenderer = ({ myMessage }) => {
  const [objectUrl, setObjectUrl] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: downloadData, error: errorDownload, loading: loadingDownload } = useFetch('/downloadAttachment');

  useEffect(() => {
    console.log('Message changed:', myMessage);
    setObjectUrl(null);
    setIsLoading(true);
    setError(null);
  }, [myMessage.time]);

  useEffect(() => {
    const downloadAttachment = async () => {
      console.log('Starting download for message:', myMessage.time);
      
      if (objectUrl) {
        setIsLoading(false);
        return;
      }

      if (loadingDownload) {
        console.log("Loading getting URL...");
        return;
      }

      if (downloadData) {
        try {
          const presignedUrl = downloadData.presignedUrl;
          console.log('Got presigned URL for message:', myMessage.id);
          const response = await fetch(presignedUrl);

          if (!response.ok) {
            throw new Error("Error downloading file");
          }

          const blob = await response.blob();
          const finalBlob = new Blob([blob], { type: myMessage.file.type });
          const newObjectUrl = URL.createObjectURL(finalBlob);
          
          console.log("Created new object URL for message:", myMessage.id, newObjectUrl);
          setObjectUrl(newObjectUrl);
          setIsLoading(false);
        } catch (error) {
          console.error("Download error:", error);
          setError(error.message);
          setIsLoading(false);
        }
      } else if (errorDownload) {
        console.error("Download data error:", errorDownload);
        setError(errorDownload.message);
        setIsLoading(false);
      }
    };

    if (!objectUrl) {
      downloadAttachment();
    }
  }, [myMessage, downloadData, loadingDownload, objectUrl]);

  const renderAttachment = () => {
    console.log('Rendering attachment for message:', myMessage.id, 'objectUrl:', objectUrl);
    const fileType = myMessage.file.type;

    if (!myMessage.file) return <p>No attachment available</p>;
    if (isLoading) {
      return (
        <div>
          <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
        </div>
      );
    }
    if (!objectUrl) return <p>Error loading attachment</p>;

    
    if (myMessage.fileType === 0 || (fileType && ((!fileType.startsWith("image/") && !fileType.startsWith("video/"))))) {
      return (
        <a href={objectUrl} download={myMessage.file.name} className="file-attachment">
          {myMessage.file.name}
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
      <div className="attachment-container">
        <p className="error-message">{error}</p>
        <a href={objectUrl} download={myMessage.file.name} className="file-attachment">
          {myMessage.file.name}
        </a>
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