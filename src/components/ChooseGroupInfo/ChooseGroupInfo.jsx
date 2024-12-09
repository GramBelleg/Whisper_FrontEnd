import NoProfile from '@/assets/images/no-profile.svg?react'
import useAuth from "@/hooks/useAuth"
import Camera from '@/assets/images/camera.svg?react'
import "./ChooseGroupInfo"
import EditableField from '../ProfileSettings/EditFields/EditableField'
import { useRef, useState } from 'react'

const ChooseGroupInfo = ({ selectedUsers, setGroupName, setGroupPicFileData }) => {
    
    const { user } = useAuth()
    const [profilePic, setProfilePic] = useState(user.profilePic || '')
    const [isHovered, setIsHovered] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file)) 
            const fileData = {
                file: file,
                extension: file.type
            }
            setGroupPicFileData(fileData)
        }
    };

    return (
        <div className='choose-group-info' 
            data-testid='test-choose-group-info-page'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='my-5' onClick={handleFileClick}>
                <div className='relative inline-block cursor-pointer'>
                    {profilePic ? (
                            <img src={profilePic} alt='Profile' className='w-40 h-40 rounded-full object-cover' />
                        ) : (
                            <NoProfile className='w-40 h-40 rounded-full object-cover' data-testid='NoProfile' />
                        )}
                        <div
                            className={`absolute inset-0 flex flex-col items-center justify-center rounded-full transition-opacity duration-300 ${profilePic ? (isHovered ? 'bg-black bg-opacity-50' : 'opacity-0') : 'bg-black bg-opacity-50'}`}
                        >
                            <Camera className='mb-1' />
                            <span className='text-white text-sm text-center max-w-[50%]'>
                                {profilePic ? 'Change Profile Photo' : 'Add Profile Photo'}
                            </span>
                        </div>
                        <input
                            type='file'
                            accept='image/*'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className='hidden'
                            data-testid='file-input'
                        />
                </div>
            </div>
            <EditableField
                initialText={''}
                fieldName='Group Name'
                id='bio'
                onSave={(value) => setGroupName(value)}
                error={() => console.log("error")}
                clearError={() => console.log("clear error")}
            />
            <div className="selected-users">
                {selectedUsers?.map((selectedUser) => (
                    <div key={selectedUser.id} className="user-item">
                        <div className="user-image">
                            <img src={selectedUser.profilePic} alt={selectedUser.name} />
                        </div>
                        <label htmlFor={`user-${selectedUser.id}`}>{selectedUser.name}</label>
                    </div>
                ))}
            </div>

        </div>
    )
}
 
export default ChooseGroupInfo;