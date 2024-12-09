import NoProfile from '@/assets/images/no-profile.svg?react'

import useAuth from "@/hooks/useAuth"
import "./ChooseGroupInfo"
import EditableField from '../ProfileSettings/EditFields/EditableField'
import { useEffect, useState } from 'react'
const ChooseGroupInfo = ({ selectedUsers }) => {
    
    const { user } = useAuth()
    const [initialText, setInitialText] = useState('');

    useEffect(() => {}, [selectedUsers])
   
    return (
        <div className='choose-group-info' data-testid='test-choose-group-info-page'>
            <div className='my-5'>
                <div className='relative inline-block cursor-pointer'>
                    {user.profilePic ? (
                        <img src={user.profilePic} alt='Profile' className='w-40 h-40 rounded-full object-cover' />
                    ) : (
                        <NoProfile className='w-40 h-40 rounded-full object-cover' />
                    )}
                </div>
            </div>
            <EditableField
                initialText={initialText}
                fieldName='Group Name'
                id='bio'
                onSave={(value) => console.log(value)}
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