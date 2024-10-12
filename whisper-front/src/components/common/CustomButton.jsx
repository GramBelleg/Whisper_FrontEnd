import React from 'react';

const CustomButton = ({ icon: Icon, label, onClick, className = '', disabled = false, type = 'button' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-3 font-bold rounded-lg transition duration-300 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-light text-dark hover:bg-primary hover:text-light'} ${className}`}
      disabled={disabled}
      type={type}
    >
      {Icon && <Icon className="mr-2" />} {/* Adds margin to the icon */}
      {label}
    </button>
  );
};

export default CustomButton;
