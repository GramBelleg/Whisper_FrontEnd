import { useProfileSettings } from "@/hooks/useProfileSettings";
import NoProfile from "@/assets/images/no-profile.svg?react";
import Camera from "@/assets/images/camera.svg?react";
import { useState, useRef, useEffect } from 'react';
import { useModal } from "@/contexts/ModalContext";
import PhotoOptionsModal from "./PhotoOptionsModal";

const EditProfilePic = ({ onEdit, onAdd, onRemove }) => {
    const { profilePic, setProfilePic, errors, loading } = useProfileSettings();
    const { openModal, closeModal } = useModal(); 
    const [isHovered, setIsHovered] = useState(false); 
    const fileInputRef = useRef(null);
    const photoRef = useRef(null); 

    useEffect(() => {
        console.log("Updated profilePic:", profilePic);
    }, [profilePic]);

    const handleClick = () => {
        if(!profilePic)
        {
            handleChangePhoto();
            return;
        }
        const { top, left, width } = photoRef.current.getBoundingClientRect(); 
        const modalPosition = {
            top: top + window.scrollY + 50, 
            left: left + window.scrollX + (width / 2), 
        };

        openModal(
            <PhotoOptionsModal
                onChangePhoto={handleChangePhoto}
                onRemovePhoto={handleRemovePhoto}
                onClose={closeModal}
                position={modalPosition} 
            />
        ); 
    };

    const handleChangePhoto = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onEdit(file);
                setProfilePic(reader.result); 
                console.log("profilePic", profilePic);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error); 
            };
            reader.readAsDataURL(file);
        }
        closeModal();
    };

    const handleRemovePhoto = () => {
        setProfilePic(null); 
        onRemove();
        closeModal();
    };

    return (
        <div
            className="relative inline-block cursor-pointer" 
            data-testid="EditProfilePic"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            onClick={handleClick} 
            ref={photoRef} 
        >
            {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-40 h-40 rounded-full object-cover" />
            ) : (
                <NoProfile className="w-40 h-40 rounded-full object-cover" data-testid="NoProfile"/>
            )}
            <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-full transition-opacity duration-300 ${profilePic ? (isHovered ? 'bg-black bg-opacity-50' : 'opacity-0') : 'bg-black bg-opacity-50'}`}>
                <Camera className="mb-1" /> 
                <span className="text-white text-sm text-center max-w-[50%]">
                    {profilePic ? 'Change Profile Photo' : 'Add Profile Photo'}
                </span> 
            </div>
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                data-testid="file-input"
            />
            {
                loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    </div>
                )
            }
        </div>
    );
}

export default EditProfilePic;
