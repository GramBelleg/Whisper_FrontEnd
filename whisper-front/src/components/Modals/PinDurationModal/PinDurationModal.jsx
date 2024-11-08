// PinDurationModal.jsx
import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';

const PinDurationModal = ({ message, onPin }) => {
    const [duration, setDuration] = useState(null);  
    const { closeModal } = useModal();

    const handlePin = () => {
        onPin(message, duration);
        closeModal();  
    };

    return (
        <div className="fixed inset-0 bg-dark bg-opacity-60 flex justify-center items-center z-50">
            <div className="relative bg-dark text-primary rounded-lg shadow-lg max-w-sm w-full p-6">

                <button onClick={closeModal} className="absolute top-4 right-4 text-primary text-2xl font-bold hover:text-opacity-80 transition-colors">
                    &times;
                </button>

                <h3 className="text-xl font-semibold mb-6 text-center">Choose how long your pin lasts</h3>

                <div className="space-y-2">
                    <button
                        onClick={() => setDuration(24)}
                        className={`w-full py-3 text-lg font-medium text-left px-4 rounded-lg transition-colors ${
                            duration === 24
                                ? 'bg-primary text-dark'
                                : 'bg-dark text-primary hover:bg-blue-950'
                        }`}
                    >
                        24 hours
                    </button>
                    <button
                        onClick={() => setDuration(168)}
                        className={`w-full py-3 text-lg font-medium text-left px-4 rounded-lg transition-colors ${
                            duration === 168
                                ? 'bg-primary text-dark'
                                : 'bg-dark text-primary hover:bg-blue-950'
                        }`}
                    >
                        7 days
                    </button>
                    <button
                        onClick={() => setDuration(720)}
                        className={`w-full py-3 text-lg font-medium text-left px-4 rounded-lg transition-colors ${
                            duration === 720
                                ? 'bg-primary text-dark'
                                : 'bg-dark text-primary hover:bg-blue-950'
                        }`}
                    >
                        30 days
                    </button>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                    <button
                        onClick={handlePin}
                        className="w-full py-2 px-4 rounded-lg bg-primary text-dark font-semibold hover:bg-opacity-90 transition-colors"
                    >
                        Pin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinDurationModal;
