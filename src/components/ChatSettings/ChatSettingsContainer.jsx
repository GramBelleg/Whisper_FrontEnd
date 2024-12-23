import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import ChatSettings from './ChatSettings';
const ChatSettingsContainer = ({chatType}) => {
    const [privacy, setPrivacy] = useState("Public");
    const { saveChannelPrivacy,
            handleGetChannelSettings,
            saveGroupSettings,
            handleGetGroupSettings} = useChat();
    const [groupLimit, setGroupLimit] = useState(0);
    const handlePrivacySubmit = async () => {
        chatType === "group"? await saveGroupSettings(null, privacy) : saveChannelPrivacy(privacy)
    };
    const handlePrivacyChange = (event) => {
        setPrivacy(event.target.value);
    };
    
    const handleGroupLimitChange = (event) => {
        const value = Number(event.target.value);
        if (value >= 0 && value<=1000) {
            setGroupLimit(value);
        }
    };

    const handleLimitSubmit = () => {
        saveGroupSettings(groupLimit, null);
    };
    useEffect(() => {
        const getChatSettings = async () => {
            try {
                const response = chatType === "group"
                    ? await handleGetGroupSettings()
                    : await handleGetChannelSettings();

                console.log(response)
                setPrivacy(response.public?'Public':'Private')
                if(chatType === "group")
                setGroupLimit(response.maxSize)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getChatSettings()
    }, [])
    return ( 
        <ChatSettings
            privacy={privacy}
            limit={groupLimit}
            handleLimitChange={handleGroupLimitChange}
            handleLimitSubmit={handleLimitSubmit}
            handlePrivacyChange={handlePrivacyChange}
            handlePrivacySubmit={handlePrivacySubmit} 
            chatType={chatType}
        />
     );
}
 
export default ChatSettingsContainer;