import React, { useEffect, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GroupSettings = () => {
    const [privacy, setPrivacy] = useState("Public");
    const [groupLimit, setGroupLimit] = useState(0);
    const { saveGroupSettings,handleGetGroupSettings } = useChat();

    useEffect(() => {
        const getGroupSettings = async () => {
            try {
                const response = await handleGetGroupSettings()
                console.log(response)
                setPrivacy(response.privacy?'Public':'Private')
                setGroupLimit(response.maxSize)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        getGroupSettings()
    }, [])
    const { pop } = useStackedNavigation(); 

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
        pop(); 
    };
    const handlePrivacySubmit = () => {
        saveGroupSettings(null, privacy);
    };

    return (
        <div className="fixed top-0 right-0 w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center space-x-4">
            <div onClick={()=> pop()} id="back">
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            </div>
            <h2 className="text-lg font-bold mb-4 text-left mb-4 mt-4"> Group Settings </h2>
            <div className="who-can-item">
                    <h3 className="text-md mb-4 text-left mb-4 mt-4 text-primary"> Group Privacy </h3>
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
                            />
                            Private
                        </label>
                    </div>
                    <div className="flex justify-start space-x-4 mt-4">
                        <button
                        onClick={handlePrivacySubmit}
                        className="text-light bg-primary px-4 py-2 rounded-md hover:bg-light hover:text-dark duration-300"
                        >
                        Save 
                        </button>
                    </div>
            </div>
            
            <div className="who-can-item">
                <label htmlFor="group-limit" className="block text-left text-primary font-medium mb-2">
                    Group Limit:
                </label>
                <input
                    id="group-limit"
                    type="number"
                    min={1}
                    max={1000}
                    value={groupLimit}
                    onChange={handleGroupLimitChange}
                    className="border bg-dark rounded-md px-3 py-2 w-full"
                />
                <div className="flex justify-start space-x-4 mt-4">
                    <button
                    onClick={handleLimitSubmit}
                    className="text-light bg-primary px-4 py-2 rounded-md hover:bg-light hover:text-dark duration-300"
                >
                    Save 
                </button>
            </div>
            </div>
           
        </div>
    );
};

export default GroupSettings;
