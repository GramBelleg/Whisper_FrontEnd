import React, { useRef, useEffect, useState } from 'react';
import GifPicker from 'gif-picker-react';
import "./CustomGifPicker.css"
const CustomGifPicker = ({ onGifSelect }) => {
    const pickerRef = useRef(null);

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowGif(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bottom-full rounded-lg p-2 shadow-lg bg-gray-800">
            <GifPicker
                tenorApiKey={import.meta.env.VITE_APP_GIF_KEY}
                onGifClick={(gif) => {
                    onGifSelect(gif);
                }}
            />
        </div>
    );
};

export default CustomGifPicker;
