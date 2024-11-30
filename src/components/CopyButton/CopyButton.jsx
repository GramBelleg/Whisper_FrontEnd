import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const CopyButton = ({ content, size = "1x" }) => {
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content]);

  return (
    <FontAwesomeIcon 
      icon={showCheck ? faCheck : faCopy}
      onClick={handleCopy}
      size={size}
      className={`
        cursor-pointer transition-all duration-200 text-white
      `}
    />
  );
};

export default CopyButton;