import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '@/hooks/useAuth'
import { useWhisperDB } from '@/contexts/WhisperDBContext'

const AwaitingJoinMessage = ({ chat }) => {
    const { user: authUser } = useAuth()
    const { dbRef } = useWhisperDB();
    const hasKey = async (id) => {
        console.log('checking key', id);
        return await dbRef.current.getKeysStore().hasKey(id);
    }
    return (
        <div className='awaiting-message'>
            <FontAwesomeIcon icon={faUser} className={`awaiting-icon`} />
            <span className={`awaiting-text`}>
                Waiting for other user to join
            </span>
        </div>
    )
}

export default AwaitingJoinMessage
