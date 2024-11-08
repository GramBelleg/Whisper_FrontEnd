import { FaThumbtack } from "react-icons/fa";
import React, { useState } from "react";

const PinnedMessages = ({ pinnedMessages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextMessage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length);
    };

    if (!pinnedMessages || pinnedMessages.length === 0) {
        return null;
    }

    return (
        <div 
            onClick={handleNextMessage} 
            className="cursor-pointer flex items-center gap-2 p-4 border-l-4 border-purple-600 sm:w-80 md:w-80 lg:w-96"
        >
            <FaThumbtack className="text-primary text-xl" />
            <div className="flex-1">
                <p className="text-primary font-semibold text-sm text-left">Pinned Message #{currentIndex + 1}</p>
                <p className="text-sm font-normal text-light break-words text-left">
                    {pinnedMessages[currentIndex].content}
                </p>
            </div>
        </div>
    );
};

export default PinnedMessages;
