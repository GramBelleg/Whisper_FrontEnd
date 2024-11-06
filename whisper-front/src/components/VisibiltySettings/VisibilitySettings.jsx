import "./VisibilitySettings.css";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { whoAmI } from '@/services/chatservice/whoAmI';
import { putLastSeenVisibilitySettings, putProfilePicVisibilitySettings, putReadReceiptsSetting } from "@/services/privacy/privacy";
import { useModal } from "@/contexts/ModalContext";
import ErrorMesssage from "../ErrorMessage/ErrorMessage";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";

const VisibilitySettings = () => {
    const [profilePictureVisibility, setProfilePictureVisibility] = useState("Everyone");
    const [storyVisibility, setStoryVisibility] = useState("Everyone");
    const [lastSeenVisibility, setLastSeenVisibility] = useState("Everyone");
    const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(whoAmI.readReceipts);

    const { openModal, closeModal } = useModal();
    const { pop } = useStackedNavigation();
    
    
    const handleGoBack = () => {
        pop();
    }

    const updateLastSeenVisibilitySettings = async (setting) =>{
        setLastSeenVisibility(setting);
        whoAmI.lastSeenVisibility = setting;

        try {
            await putLastSeenVisibilitySettings(setting);
        } catch (error) {
            openModal(
                <ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000}/>
            );
        }
    }

    const updateProfilePicVisibiitySettings = async (setting) => {
        setProfilePictureVisibility(setting);
        whoAmI.profilePicprofileVisibility = setting;

        try {
            await putProfilePicVisibilitySettings(setting);
        } catch (error) {
            openModal(
                <ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000}/>
            );
        }
    }
    const updateStoryVisibilitySettings = () => {

    }
    
    const updateReadReceiptsSetting = async (enabled) => {
        try {
            const data = await putReadReceiptsSetting(enabled);
            setReadReceiptsEnabled(!readReceiptsEnabled);
        } catch (error) {
            openModal(
                <ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000}/>
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
                                data-testid="profile-pic-visibiity-Everyone"
                                type="radio" 
                                value="Everyone" 
                                checked={profilePictureVisibility === "Everyone"} 
                                onChange={() => updateProfilePicVisibiitySettings("Everyone")} 
                            />
                            Everyone
                        </label>
                        <label>
                            <input 
                                data-testid="profile-pic-visibiity-Contacts"
                                type="radio" 
                                value="Contacts" 
                                checked={profilePictureVisibility === "Contacts"} 
                                onChange={() => updateProfilePicVisibiitySettings("Contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                data-testid="profile-pic-visibiity-noone"
                                type="radio" 
                                value="Nobody" 
                                checked={profilePictureVisibility === "Nobody"} 
                                onChange={() => updateProfilePicVisibiitySettings("Nobody")} 
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
                                data-testid="story-visibility-Everyone"
                                type="radio" 
                                value="Everyone" 
                                checked={storyVisibility === "Everyone"} 
                                onChange={() => setStoryVisibility("Everyone")} 
                            />
                            Everyone
                        </label>
                        <label>
                            <input 
                                data-testid="story-visibility-Contacts"
                                type="radio" 
                                value="Contacts" 
                                checked={storyVisibility === "Contacts"} 
                                onChange={() => setStoryVisibility("Contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                data-testid="story-visibility-noone"
                                type="radio" 
                                value="Nobody" 
                                checked={storyVisibility === "Nobody"} 
                                onChange={() => setStoryVisibility("Nobody")} 
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
                                data-testid="last-seen-Everyone"
                                type="radio" 
                                value="Everyone" 
                                checked={lastSeenVisibility === "Everyone"} 
                                onChange={() => updateLastSeenVisibilitySettings("Everyone")} 
                            />
                            Everyone
                        </label>
                        <label>
                            <input 
                                data-testid="last-seen-Contacts"
                                type="radio" 
                                value="Contacts" 
                                checked={lastSeenVisibility === "Contacts"} 
                                onChange={() => updateLastSeenVisibilitySettings("Contacts")} 
                            />
                            My Contacts
                        </label>
                        <label>
                            <input 
                                data-testid="last-seen-nooone"
                                type="radio" 
                                value="Nobody" 
                                checked={lastSeenVisibility === "Nobody"} 
                                onChange={() => updateLastSeenVisibilitySettings("Nobody")} 
                            />
                            No One
                        </label>
                    </div>
                </div>
                <div className="who-can-item toggle-container">
                    <h2>Read Receipts</h2>
                    <div className="toggle-switch">
                        <input 
                            data-testid="toggle-switch-test"
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
