import { StackedNavigationProvider } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import GroupInfo from "./GroupInfo";
const GroupInfoContainer = ({currentChat, onClose}) => {
    return ( 
        <StackedNavigationProvider>
            <GroupInfo onClose={onClose} currentChat={currentChat} />
        </StackedNavigationProvider>
     );
}
 
export default GroupInfoContainer;