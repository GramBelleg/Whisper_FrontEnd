import { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import GroupMembers from './GroupMembers'
import useAuth from '@/hooks/useAuth'
import { updateGroupMemberPermissions, updateChannelMemberPermissions } from '@/services/chatservice/updateChatMemberPermissions';

const GroupMembersContainer = ({chatType}) => {
    const [query, setQuery] = useState('')
    const [members, setMembers] = useState([])
    const [amIAdmin, setAmIAdmin] = useState(false)
    const [permissionsState, setPermissionsState] = useState({});
    const { user } = useAuth()
    const filteredMembers = members?.filter((member) => member.userName?.toLowerCase().includes(query.toLowerCase()))
    // console.log(filteredMembers)
    const {
        handleGetMembers,
        addAdmin,
        removeFromChat,
        currentChat,
        handleGetMembersPermissions,
        handleGetSubscribersPermissions
      } = useChat();
      
    const handlePermissionsToggle = async (permission, memberId) => {
        const currentPermissions = permissionsState[memberId];
        console.log(currentPermissions);
        currentPermissions[permission] = !currentPermissions[permission];
        console.log(currentPermissions,"after");
        try {
            console.log("memberId",memberId);
            console.log("currentPermissions",currentPermissions);
            response = chatType === 'group' 
            ? await updateGroupMemberPermissions(currentChat.id,memberId, currentPermissions) 
            : await updateChannelMemberPermissions(currentChat.id,memberId, currentPermissions);

            setPermissionsState((prevState) => ({
                ...prevState,
                [memberId]: currentPermissions,
            }));
            console.log(response);
        }
        catch (error) {
            console.error('Error updating permissions:', error);
        }
    };
    const handleAddAmin = async (userId) => {
        try {
            await addAdmin(userId)
            setMembers(members.map((member) => {
                if (member.id === userId) {
                    return { ...member, isAdmin: true }
                }
                return member
            }))
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemoveFromChat = async (incomingUser) => {
        try {
            console.log(incomingUser)
            await removeFromChat(incomingUser)
            setMembers(members.filter((member) => member.id !== incomingUser.id))
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        const fetchPermissions = async () => {
            if (amIAdmin) {
                try {
                    let permissionsState;
                    if (chatType === 'group') {
                        permissionsState = await handleGetMembersPermissions();
                    }
                    else if (chatType === 'channel') {
                        permissionsState = await handleGetSubscribersPermissions();
                    }
                    else
                    {
                        console.log('Invalid type');
                        return;
                    }

                    const initialState = {};
                    filteredMembers.forEach((member) => {
                        initialState[member.id] = permissionsState[member.id] || {};
                    });

                    setPermissionsState(initialState);
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            }
        };

        fetchPermissions();
    }, [filteredMembers, amIAdmin, handleGetMembersPermissions]);
    const getMembers = async () => {
        try {
            const response = await handleGetMembers()
            console.log(response)
            setMembers(response)
            const admins = response.filter((member) => member.isAdmin)
            setAmIAdmin(
                admins.filter((admin) => admin.id === user.id).length > 0
            )
        } catch (error) {
            console.error('Error fetching members:', error)
        }
    }
    useEffect(() => {
        getMembers()
    }, [])


    const handleQueryChange = (value) => {
        setQuery(value)
    }
    return (
        <GroupMembers 
            query={query}
            filteredMembers={filteredMembers} 
            handleQueryChange={handleQueryChange}
            handleAddAmin={handleAddAmin}
            handleRemoveFromChat={handleRemoveFromChat}
            amIAdmin={amIAdmin}
            type={chatType}
            handlePermissionsToggle={handlePermissionsToggle}
            permissionsState={permissionsState}
            
        />
    )
}

export default GroupMembersContainer
