import React, { useEffect, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatPrivacy from "../ChatPrivacy/ChatPrivacy";

const ChannelSettings = () => {
    const [privacy, setPrivacy] = useState("Public");
    const {saveChannelPrivacy,handleGetChannelSettings} = useChat();
    const { pop } = useStackedNavigation(); 

    useEffect(() => {
        const getChannelPrivacy = async () => {
            try {
                const response = await handleGetChannelSettings()
                setPrivacy(response.public ? 'Public' : 'Private')
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getChannelPrivacy()
    }, [])

    const handlePrivacySubmit = async () => {
        await saveChannelPrivacy(privacy)
    };
    const handlePrivacyChange = (event) => {
        setPrivacy(event.target.value);
    };

    return (
        <div className="fixed top-[2.5%] right-[4.5%] w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center space-x-4">
            <div onClick={()=> pop()} id="back" data-testid="back" className="cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            </div>
            <h2 className="text-lg font-bold mb-4 text-left mb-4 mt-4"> Channel Settings </h2>
            <ChatPrivacy 
                privacy={privacy}
                handlePrivacyChange={handlePrivacyChange} 
                handlePrivacySubmit={handlePrivacySubmit}
                title={"Channel Settings"}
            />
        </div>
    );
};

export default ChannelSettings;
