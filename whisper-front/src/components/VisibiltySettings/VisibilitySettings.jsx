import "./VisibilitySettings.css";

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { whoAmI } from '@/services/chatservice/whoAmI';
import { putReadReceiptsSetting } from "@/services/privacy/privacy";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";

const VisibilitySettings = () => {
    const [profilePictureVisibility, setProfilePictureVisibility] = useState("everybody");
    const [storyVisibility, setStoryVisibility] = useState("everybody");
    const [lastSeenVisibility, setLastSeenVisibility] = useState("everybody");
    const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(whoAmI.readReceipts);

    const { setActivePage } = useSidebar();  
    const { openModal, closeModal } = useModal();
    const { pop } = useStackedNavigation();
    
    const handleGoBack = () => {
        pop();
    }

    
    const updateReadReceiptsSetting = async (enabled) => {
        try {
            const data = await putReadReceiptsSetting(enabled);
            setReadReceiptsEnabled(!readReceiptsEnabled);
        } catch (error) {
            openModal(
                <ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={2000}/>
            );
        }
        
    };
    const toggleReadReceipts = () => {
        updateReadReceiptsSetting(!readReceiptsEnabled);
    };

    useEffect(() => {
        setStoryVisibility(whoAmI.storySettings);
        setProfilePictureVisibility(whoAmI.profileVisibility);
        setLastSeenVisibility(whoAmI.lastSeenVisibility);
    },[])
    return ( 
        <div className="visibility-settings" data-testid="test-visibility-page">
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon className='back-icon' icon={faArrowLeft} onClick={handleGoBack}/>
                <h1>Visibility Settings</h1>
            </div>
            <div className="who-can">
                <div className="who-can-item">
                    <h2>Who Can See My Profile Picture?</h2>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                value="everybody" 
                                checked={profilePictureVisibility === "everybody"} 
                                onChange={() => setProfilePictureVisibility("everybody")} 
                            />
                            Everybody
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="contacts" 
                                checked={profilePictureVisibility === "contacts"} 
                                onChange={() => setProfilePictureVisibility("contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="no-one" 
                                checked={profilePictureVisibility === "no-one"} 
                                onChange={() => setProfilePictureVisibility("no-one")} 
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className="who-can-item">
                    <h2>Who Can See My Stories?</h2>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                value="everybody" 
                                checked={storyVisibility === "everybody"} 
                                onChange={() => setStoryVisibility("everybody")} 
                            />
                            Everybody
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="contacts" 
                                checked={storyVisibility === "contacts"} 
                                onChange={() => setStoryVisibility("contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="no-one" 
                                checked={storyVisibility === "no-one"} 
                                onChange={() => setStoryVisibility("no-one")} 
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className="who-can-item">
                    <h2>Who Can See My Last Seen?</h2>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                value="everybody" 
                                checked={lastSeenVisibility === "everybody"} 
                                onChange={() => setLastSeenVisibility("everybody")} 
                            />
                            Everybody
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="contacts" 
                                checked={lastSeenVisibility === "contacts"} 
                                onChange={() => setLastSeenVisibility("contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="no-one" 
                                checked={lastSeenVisibility === "no-one"} 
                                onChange={() => setLastSeenVisibility("no-one")} 
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className="who-can-item toggle-container">
                    <h2>Read Receipts</h2>
                    <div className="toggle-switch">
                        <input 
                            type="checkbox" 
                            id="readReceipts" 
                            checked={readReceiptsEnabled} 
                            onChange={() => toggleReadReceipts()}
                        />
                        <label htmlFor="readReceipts" className="toggle-label"></label>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default VisibilitySettings;
