
import ProfileContainer from "@/components/ProfileSettings/ProfileContainer";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
const ProfileStacked = () => {
    const { pop } = useStackedNavigation()
    return ( 
        <div className="p-4">
        <ProfileContainer popPage={() => {pop()}} />
        </div>
     );
}
 
export default ProfileStacked;