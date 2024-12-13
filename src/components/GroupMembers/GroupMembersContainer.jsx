import { useEffect, useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import GroupMembers from './GroupMembers'

const GroupMembersContainer = () => {
    const [query, setQuery] = useState('')
    const [members, setMembers] = useState([])
    const { handleGetMembers } = useChat()

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await handleGetMembers()
                console.log(response)
                setMembers(response)
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
    return <GroupMembers filteredMembers={filteredMembers} handleQueryChange={handleQueryChange} />
}

export default GroupMembersContainer
