import ChatPrivacy from "../ChatPrivacy/ChatPrivacy";
const GroupSettings = ({
    privacy, 
    limit, 
    handlePrivacyChange, 
    handlePrivacySubmit, 
    handleLimitChange, 
    handleLimitSubmit
    }) => {

    return (
        <div>
            <h2 className="text-lg font-bold mb-4 text-left mb-4 mt-4"> Group Settings </h2>
                    <ChatPrivacy 
                        privacy={privacy}
                        handlePrivacyChange={handlePrivacyChange} 
                        handlePrivacySubmit={handlePrivacySubmit}
                        title={"Group Privacy"} 
                    />
            
            <div className="who-can-item">
                <label htmlFor="group-limit" className="block text-left text-primary font-medium mb-2">
                    Group Limit:
                </label>
                <input
                    id="group-limit"
                    data-testid="group-limit"
                    type="number"
                    min={1}
                    max={1000}
                    value={limit}
                    onChange={handleLimitChange}
                    className="border bg-dark rounded-md px-3 py-2 w-full"
                />
                <div className="flex justify-start space-x-4 mt-4">
                    <button
                    onClick={handleLimitSubmit}
                    data-testid='save-limit'
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
