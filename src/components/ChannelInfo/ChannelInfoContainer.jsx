import { StackedNavigationProvider } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import ChannelInfo from "./ChannelInfo";

const ChannelInfoContainer = ({currentChat, onClose}) => {
    return ( 
        <StackedNavigationProvider>
            <ChannelInfo onClose={onClose} currentChat={currentChat} />
        </StackedNavigationProvider>
     );
}
 
export default ChannelInfoContainer;