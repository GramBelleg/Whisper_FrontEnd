import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faAdd } from "@fortawesome/free-solid-svg-icons";
import CopyButton from "../CopyButton/CopyButton";
import GroupMembersContainer from "../GroupMembers/GroupMembersContainer";

const ChatInfo = ({
    currentChat,
    handleClose,
    type,
    handleAddUsers,
    handleEdit,
    channelInvite,
    isVisible,
}) => {
    return (
        <div
            className={`fixed top-[2.5%] right-[4.5%] w-80 h-[95%] bg-dark text-light shadow-lg z-200 p-4 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-[200%]"
            }`}
        >
            <div className="h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{type} info</h3>
                    <div className="flex justify-between items-center space-x-4">
                        {currentChat.isAdmin && (
                            <div className="flex justify-between items-center">
                                <button
                                    className="text-light m-1"
                                    onClick={handleAddUsers}
                                    data-testid="add-button"
                                >
                                    <FontAwesomeIcon icon={faAdd} />
                                </button>
                                <button
                                    className="text-light m-1"
                                    onClick={handleEdit}
                                    data-testid="edit-button"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                        )}
                        <button
                            className="text-white"
                            onClick={handleClose}
                            data-testid="close-button"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="mb-6">
                    <img
                        src={currentChat.profilePic}
                        alt={currentChat.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-lg text-center">{currentChat.name}</h4>
                    <p className="text-center text-sm text-gray-400">{currentChat.type}</p>
                </div>
                {type === "channel" && (
                    <div>
                        <h3 className="text-left text-sm text-gray-400">Invitation Link</h3>
                        <div className="flex flex-row justify-between">
                            <h3
                                className="pr-6 truncate max-w-[calc(100%-3rem)]"
                                title={channelInvite}
                            >
                                {channelInvite}
                            </h3>
                            <CopyButton content={channelInvite} />
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-600 pt-4">
                    <GroupMembersContainer chatType={type} />
                </div>
            </div>
        </div>
    );
};

export default ChatInfo;
