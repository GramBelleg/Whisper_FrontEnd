import { StackedNavigationProvider } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import ChatInfoContainer from "@/components/ChatInfo/ChatInfoContainer";
const ChatInfoPage = ({onClose, currentChat}) => {
    return (
        <StackedNavigationProvider>
            <ChatInfoContainer onClose={onClose} currentChat={currentChat} />
        </StackedNavigationProvider>
      );
}
 
export default ChatInfoPage;