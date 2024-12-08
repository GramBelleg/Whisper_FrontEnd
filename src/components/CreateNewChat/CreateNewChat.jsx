

const CreateNewChat = ( myOnMouseLeave, handleCreateGroupClick, handleCreatePrivateClick, handleCreateChannelClick ) => {
    
    return ( 
        <div 
            className="create-drop-down"
            onMouseLeave={myOnMouseLeave}
        >
            <ul>
                <li>
                    <button onClick={handleCreateGroupClick}>
                        New Group
                    </button>
                </li>
                <li>
                    <button onClick={handleCreatePrivateClick}>
                        New Private Chat
                    </button>
                </li>
                <li>
                    <button onClick={handleCreateChannelClick}>
                        New Channel
                    </button>
                </li>
            </ul>
        </div>
    );
}
 
export default CreateNewChat;