// This renders sent or recieved stickers
// It is used by the last message

import './DeletedMessage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'

const DeletedMessage = ({ sender }) => {
    const { user } = useAuth();
    const [whoDeleted, setWhoDeleted] = useState('You')

    useEffect(() => {
        if (user.name === sender) {
            setWhoDeleted('You')
        } else {
            setWhoDeleted(sender)
        }
    }, [sender])

    return (
        <div className='deleted-message'>
            <FontAwesomeIcon icon={faBan} className='deleted-icon' />
            <span className='deleted-text'> {whoDeleted} deleted this message</span>
        </div>
    )
}

export default DeletedMessage
