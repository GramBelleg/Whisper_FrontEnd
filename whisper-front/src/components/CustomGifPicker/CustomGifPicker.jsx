import GifPicker from 'gif-picker-react';
import React, { useState, useEffect, useRef } from 'react';
import "./CustomGifPicker.css"

const CustomGifPicker = ({ onGifSelect }) => {
  const [showGif, setShowGif] = useState(false);
  const pickerRef = useRef(null);

  const toggleGifPicker = () => {
    setShowGif((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowGif(false);
    }
  };

  const handleGifSelect = (gifObject) => {
    console.log(gifObject)
    onGifSelect(gifObject);
    setShowGif(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        onClick={toggleGifPicker} 
        className="cursor-pointer px-2 text-sm text-primary hover:text-light duration-300"
      >
        GIF
      </div>
      {showGif && (
        <div className="absolute bottom-full mb-2 z-50 p-2 rounded shadow-lg">
          <GifPicker tenorApiKey={import.meta.env.VITE_APP_GIF_KEY} onGifClick={handleGifSelect} />
        </div>
      )}
    </div>
  );
};

export default CustomGifPicker;
