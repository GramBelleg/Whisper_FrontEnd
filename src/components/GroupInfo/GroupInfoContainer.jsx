import { StackedNavigationProvider } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import GroupInfo from "./GroupInfo";
import { useChat } from "@/contexts/ChatContext";
const GroupInfoContainer = ({currentChat, onClose}) => {
    const {currentChat} = useChat();
    return ( 
        <StackedNavigationProvider>
            <GroupInfo onClose={onClose} currentChat={currentChat} isAdmin={currentChat.isAdmin} />
        </StackedNavigationProvider>
     );
}
 
export default GroupInfoContainer;