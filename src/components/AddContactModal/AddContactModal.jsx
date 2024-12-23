import EditableField from "../ProfileSettings/EditFields/EditableField";


const AddContactModal = ({ onAddUser, onClose }) => {
    let tempUserName = ''
    return ( 
        <div>
            <EditableField
                initialText={''}
                fieldName='User Name'
                id='add_user_name'
                onSave={(value) => {
                    tempUserName = value
                }}
                error={() => console.log("error")}
                clearError={() => console.log("clear error")}
            />
            <button 
                className="rounded bg-[var(--accent-color)] hover:bg-opacity-80 text-white w-[20%]"
                onClick={async () => {
                    await onAddUser(tempUserName)
                    onClose()
                }}
            >
                        Add
            </button>
        </div>
    );
}
 
export default AddContactModal;