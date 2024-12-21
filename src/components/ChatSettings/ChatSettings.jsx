import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import GroupSettings from "../GroupSettings/GroupSettings";
import ChannelSettings from "../ChannelSettings/ChannelSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const ChatSettings = (
    {
        handleLimitChange,
        handleLimitSubmit,
        handlePrivacyChange,
        handlePrivacySubmit,
        chatType,
        privacy,
        limit
    }) => {
    const { pop } = useStackedNavigation();
    return ( 
        <div className="fixed top-[2.5%] right-[4.5%] w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center space-x-4">
                <div onClick={()=> pop()} id="back" data-testid="back">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            </div>
           { chatType === "group" ? (
                <GroupSettings
                    privacy={privacy}
                    limit={limit}
                    handleLimitChange={handleLimitChange}
                    handlePrivacyChange={handlePrivacyChange}
                    handleLimitSubmit={handleLimitSubmit}
                    handlePrivacySubmit={handlePrivacySubmit} />
            ) : (
                <ChannelSettings
                    privacy={privacy}
                    handlePrivacyChange={handlePrivacyChange}
                    handlePrivacySubmit={handlePrivacySubmit} />
            )}
        </div>
     );
}
 
export default ChatSettings;