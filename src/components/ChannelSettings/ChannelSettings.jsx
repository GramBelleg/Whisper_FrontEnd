import React, { useEffect, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChannelSettings = () => {
    const [privacy, setPrivacy] = useState("Public");
    const {saveChannelPrivacy,handleGetChannelSettings} = useChat();
    const { pop } = useStackedNavigation(); 

    useEffect(() => {
        const getChannelPrivacy = async () => {
            try {
                const response = await handleGetChannelSettings()
                setPrivacy(response.public ? 'Private' : 'Public')
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getChannelPrivacy()
    }, [])

    const handlePrivacySubmit = async () => {
        await saveChannelPrivacy(privacy)
    };

    return (
        <div className="fixed top-[2.5%] right-[4.5%] w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center space-x-4">
            <div onClick={()=> pop()} id="back" data-testid="back" className="cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            </div>
            <h2 className="text-lg font-bold mb-4 text-left mb-4 mt-4"> Channel Settings </h2>
            <div className="who-can-item">
                    <h3 className="text-md mb-4 text-left mb-4 mt-4 text-primary"> Channel Privacy </h3>
                    <div className='radio-group'>
                        <label>
                            <input
                                id="public"
                                type='radio'
                                value='Public'
                                checked={privacy === 'Public'}
                                onChange={() => setPrivacy("Public")}
                            />
                            Public
                        </label>
    
                        <label>
                            <input
                                id="private"
                                type='radio'
                                value='Private'
                                checked={privacy === 'Private'}
                                onChange={() => setPrivacy("Private")}
                                data-testid='private'
                            />
                            Private
                        </label>
                    </div>
                    <div className="flex justify-start space-x-4 mt-4">
                        <button
                        onClick={handlePrivacySubmit}
                        data-testid='save-privacy'
                        className="text-light bg-primary px-4 py-2 rounded-md hover:bg-light hover:text-dark duration-300"
                        >
                        Save 
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default ChannelSettings;
