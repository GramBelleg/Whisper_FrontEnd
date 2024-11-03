import { useEffect, useRef, useState } from "react";
import "./MySingleStory.css"
import { downloadBlob } from "@/services/blobs/blob";

const MySingleStory = ({ story }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [url, setUrl] = useState(null);
    const videoRef = useRef();


  
    useEffect(() => {
        setUrl(null);
        setLoading(true);
        setError('');
        const getUrl = async () => {
            try {
                const { blob, error } = await downloadBlob({ "presignedUrl": story.media });
                const finalBlob = new Blob([blob], { type: story.type });
                const newObjectUrl = URL.createObjectURL(finalBlob);
                setUrl(newObjectUrl);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        getUrl();
        

    
        return () => {
            if (url) URL.revokeObjectURL(url);
        };  
    }, [story]);

    const returnedMessage = () => {
  
        if (loading) {
            return (
                <div className="flex items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
            );
        }
    
        if (error) {
            return (
                <div className="flex items-center justify-center w-full h-full text-red-500">
                Error: {error}
                </div>
            );
        }
    
        if (!url) {
            return null;
        }
    
        if (story.type.startsWith("image/")) {
            return (
                <img
                key={`${story.id}-${url}`}
                src={url}
                alt="Story content"
                className="w-full h-full object-contain"
                onError={() => setError("Failed to load image")}
                />
            );
        }
    
        if (story.type.startsWith("video/")) {
            return (
                <video
                    key={`${story.id}-${url}`}
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-contain"
                >
                <source
                    src={url}
                    type={story.type}
                    onError={(e) => {
                    console.error("Video error:", e);
                    setError("Failed to load video");
                    }}
                />
                Your browser does not support this video format.
                </video>
            );
        }
    }
  
    return (
        <>
            {returnedMessage()}
            <div className="story-content-text">
                {story.content}
            </div>
        </>
    );
  };

export default MySingleStory;
