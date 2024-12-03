import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useModal } from '@/contexts/ModalContext'
import ChatSelector from '@/components/ChatSelector/ChatSelector'
import './BlockUserModal.css'

const BlockUserModal = ({ blockUser }) => {
    const { closeModal } = useModal()

    const triggerBlockUser = (chat) => {
        blockUser(chat)
        closeModal()
    }

    return (
        <div className='block-user-modal' data-testid='block-user-modal'>
            <ChatSelector onChatSelect={triggerBlockUser} searchPlaceholder='Block user...' className='forward-modal-selector' />
        </div>
    )
}

export default BlockUserModal
