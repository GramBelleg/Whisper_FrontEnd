import { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import GroupMembers from './GroupMembers'
import useAuth from '@/hooks/useAuth'

const GroupMembersContainer = ({chatType}) => {
    const [query, setQuery] = useState('')
    const [members, setMembers] = useState([])
    const { handleGetMembers, addAdmin, removeFromChat, currentChat } = useChat()
    const [amIAdmin, setAmIAdmin] = useState(false)
    const { user } = useAuth()

    const handleAddAmin = async (userId) => {
        try {
            await addAdmin(userId)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemoveFromChat = async (incomingUser) => {
        try {
            console.log(incomingUser)
            await removeFromChat(incomingUser)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
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

        getMembers()
    }, [])

    const filteredMembers = members?.filter((member) => member.userName?.toLowerCase().includes(query.toLowerCase()))

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }
    return (
        <GroupMembers 
            filteredMembers={filteredMembers} 
            handleQueryChange={handleQueryChange}
            handleAddAmin={handleAddAmin}
            handleRemoveFromChat={handleRemoveFromChat}
            amIAdmin={amIAdmin}
            type={chatType}
        />
    )
}

export default GroupMembersContainer
