import { useProfileSettings } from "@/hooks/useProfileSettings";
import NoProfile from "@/assets/images/no-profile.svg?react";
import Camera from "@/assets/images/camera.svg?react";
import { useState } from 'react';

const EditProfilePic = ({ onEdit, onAdd }) => {
    const { profilePic } = useProfileSettings();
    //const profilePic = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"


    const [isHovered, setIsHovered] = useState(false); 

    const handleClick = () => {
        profilePic ? onEdit() : onAdd();
    };

    return (
        <div
            className="relative inline-block cursor-pointer" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            onClick={handleClick} 
        >
            {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-40 h-40 rounded-full object-cover" />
            ) : (
                <NoProfile className="w-40 h-40 rounded-full object-cover" />
            )}
            <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-full transition-opacity duration-300 ${profilePic ? (isHovered ? 'bg-black bg-opacity-50' : 'opacity-0') : 'bg-black bg-opacity-50'}`}>
                <Camera className="mb-1" /> 
                <span className="text-white text-sm text-center max-w-[50%]">
                    {profilePic ? 'Change Profile Photo' : 'Add Profile Photo'}
                    </span> 
            </div>
        </div>
    );
}

export default EditProfilePic;
