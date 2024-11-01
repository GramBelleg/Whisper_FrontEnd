import { useProfileSettings } from "@/hooks/useProfileSettings";
import NoProfile from "@/assets/images/no-profile.svg?react";
import { useState } from 'react';

const EditProfilePic = ({ onEdit, onAdd }) => {
    const { profilePic } = useProfileSettings();
    const [isHovered, setIsHovered] = useState(false); 

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            onClick={profilePic ? onEdit : onAdd} 
        >
            {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-40 h-40 rounded-full object-cover" />
            ) : (
                <NoProfile className="w-40 h-40 rounded-full object-cover" />
            )}
            <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ${profilePic ? (isHovered ? 'bg-black bg-opacity-50' : 'opacity-0') : 'bg-black bg-opacity-50'}`}>
                <span className="text-white text-lg cursor-pointer">{profilePic ? 'Edit Photo' : 'Add Photo'}</span>
            </div>
        </div>
    );
}

export default EditProfilePic;
