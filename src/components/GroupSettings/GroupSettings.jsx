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
        if (value >= 0) {
            setGroupLimit(value);
        }
    };

    const handleSubmit = () => {
        saveGroupSettings(groupLimit, privacy);
        alert(`Settings Saved!\nPrivacy: ${privacy}\nGroup Limit: ${groupLimit}`);
        pop(); // Close the settings screen
    };
    useEffect(() => {
        console.log("mounted")
    },[]
    )

    return (
        <div className="fixed top-0 right-0 w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center space-x-4">
            <div onClick={()=>pop()}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            </div>
            <h2 className="text-lg font-bold mb-4 text-left mb-4 mt-4">Group Settings</h2>
            <div className="m-4">
                <label htmlFor="privacy" className="block text-left text-primary font-medium mb-2">
                    Privacy Setting:
                </label>
                <select
                    id="privacy"
                    value={privacy}
                    onChange={handlePrivacyChange}
                    className="border bg-dark rounded-md px-3 py-2 w-full"
                >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
            </div>
            <div className="m-4">
                <label htmlFor="group-limit" className="block text-left text-primary font-medium mb-2">
                    Group Limit:
                </label>
                <input
                    id="group-limit"
                    type="number"
                    value={groupLimit}
                    onChange={handleGroupLimitChange}
                    className="border bg-dark rounded-md px-3 py-2 w-full"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="text-white px-4 py-2 rounded-md hover:bg-primary duration-300"
            >
                Save Settings
            </button>
        </div>
    );
};

export default GroupSettings;
