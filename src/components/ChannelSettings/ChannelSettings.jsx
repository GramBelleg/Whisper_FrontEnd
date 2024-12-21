import ChatPrivacy from "../ChatPrivacy/ChatPrivacy";

const ChannelSettings = ({
    privacy,
    handlePrivacyChange,
    handlePrivacySubmit
    }) => {

    return (
        <div>
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
