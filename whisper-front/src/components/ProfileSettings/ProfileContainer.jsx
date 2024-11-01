import EditableField from "./EditFields/EditableField";
import EditProfilePic from "./ProfilePicture/EditProfilePic";
const ProfileContainer = () => {
    //TODOS !!
    const handleProfilePicEdit = () => {
        console.log('Edit profile picture clicked');
    };
    const handleBioEdit = () => {
        console.log('Edit bio clicked');
    }
    const handleNameEdit = () => {
        console.log('Edit name clicked');
    }
    const handleEmailEdit = () => {
        console.log('Edit email clicked');
    }
    const handlePasswordEdit = () => {
        console.log('Edit password clicked');
    }
    const handlePhoneEdit = () => {
        console.log('Edit phone clicked');
    }
    const handleUsernameEdit = () => {
        console.log('Edit username clicked');
    }

    return ( 
        <div>
            <h1 className="text-xl text-light mb-6 text-left">Profile Settings</h1>
            <EditProfilePic onEdit={handleProfilePicEdit} />
            <EditableField initialText="test-bio" fieldName="Bio" />
            <EditableField initialText="test-name" fieldName="Name" />
            {/* Rest of the components go here (bio,name,...) */}
        </div>
     );
}
 
export default ProfileContainer;