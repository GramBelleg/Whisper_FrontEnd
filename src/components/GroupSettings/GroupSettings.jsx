import React, { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'

const GroupSettings = () => {
    const [privacy, setPrivacy] = useState('Public')
    const [groupLimit, setGroupLimit] = useState(0)
    const [error,setError] = useState('')
    const { saveGroupSettings,handleGetGroupSettings } = useChat();

    useEffect(() => {
        const getGroupSettings = async () => {
            try {
                const response = await handleGetGroupSettings()
                console.log(response)
                setPrivacy(response.privacy?'Public':'Private')
                setGroupLimit(response.maxSize)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getGroupSettings()
    }, [])

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
        saveGroupSettings(groupLimit,privacy)
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

            <div className='m-4'>
                <label htmlFor='privacy' className='block text-left text-primary font-medium mb-2'>
                    Privacy Setting:
                </label>
                <select id='group-limit' value={groupLimit} onChange={handleGroupLimitChange} className='border bg-dark rounded-md px-3 py-2 w-full'>
                    <option value='20'>20</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                    <option value='500'>500</option>
                    <option value='1000'>1000</option>
                </select>
            </div>


            <button onClick={handleSubmit} className=' text-white px-4 py-2 rounded-md hover:bg-primary duration-300'>
                Save Settings
            </button>
        </div>
    )
}

export default GroupSettings
