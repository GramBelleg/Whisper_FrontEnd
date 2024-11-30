import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/contexts/ModalContext";
import { useChat } from "@/contexts/ChatContext";
import parentRelationshipTypes from "@/services/chatservice/parentRelationshipTypes";
import ChatSelector from "@/components/ChatSelector/ChatSelector";
import "./ForwardMessageModal.css";

const ForwardMessageModal = ({ message }) => {
  const { updateParentMessage, selectChat } = useChat();
  const { closeModal } = useModal();

  const handleForward = (chat) => {
    selectChat(chat);
    updateParentMessage(message, parentRelationshipTypes.FORWARD);
    closeModal();
  };
  
  return (
    <div className="forward-message-modal">
      <ChatSelector
        onChatSelect={handleForward}
        searchPlaceholder="Forward to..."
        className="forward-modal-selector"
      />
    </div>
  );
};

export default ForwardMessageModal;