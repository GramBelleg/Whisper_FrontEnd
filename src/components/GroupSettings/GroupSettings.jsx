import React, { useState } from 'react'
import EditableField from '../ProfileSettings/EditFields/EditableField'

const GroupSettings = () => {
    const [privacy, setPrivacy] = useState('Public')
    const [groupLimit, setGroupLimit] = useState(0)
    const [error,setError] = useState('')

    const handlePrivacyChange = (event) => {
        setPrivacy(event.target.value)
    }

    const handleGroupLimitChange = (event) => {
        const value = Number(event.target.value)
        if (value >= 0) {
            setGroupLimit(value)
        }
    }

    const handleSubmit = () => {
        console.log('Privacy Setting:', privacy)
        console.log('Group Limit:', groupLimit)
        alert(`Settings Saved!\nPrivacy: ${privacy}\nGroup Limit: ${groupLimit}`)
    }

    return (
        <div className='group-settings bg-dark p-4 border rounded-lg shadow-md text-light'>
            <h2 className='text-lg font-bold mb-4'>Group Settings</h2>

            <div className='m-4'>
                <label htmlFor='privacy' className='block text-left text-primary font-medium mb-2'>
                    Privacy Setting:
                </label>
                <select id='privacy' value={privacy} onChange={handlePrivacyChange} className='border bg-dark rounded-md px-3 py-2 w-full'>
                    <option value='Public'>Public</option>
                    <option value='Private'>Private</option>
                </select>
            </div>

            <EditableField
                initialText={groupLimit}
                fieldName='Group Limit'
                id='group-limit'
                onSave={(value) => handleGroupLimitChange(value)}
                error={error}
                clearError={()=>setError('')}
            />

            <button onClick={handleSubmit} className=' text-white px-4 py-2 rounded-md hover:bg-primary duration-300'>
                Save Settings
            </button>
        </div>
    )
}

export default GroupSettings
