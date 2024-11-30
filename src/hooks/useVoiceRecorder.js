import { useState, useCallback, useRef, useEffect } from 'react';

const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.current.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      intervalRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (error) {
      alert('Error accessing microphone: '+error);
    }
  }, []);

  const stopRecording = useCallback((callback) => {
    if (mediaRecorder.current && isRecording) {
        // This promise resolves when the audio URL is available
      const audioBlobPromise = new Promise((resolve) => {
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          resolve(url);
        };
      });

      mediaRecorder.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      audioBlobPromise.then(url => {
        if (callback) {
          callback(url);
        }
      });
    }
  }, [isRecording]);

  const discardRecording = useCallback(() => {
    stopRecording();
    setAudioUrl(null);
    setDuration(0);
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    discardRecording,
  };
};

export default useVoiceRecorder;