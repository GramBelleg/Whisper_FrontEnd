import { useEffect, useState } from "react"
import "./ChooseGroupMembers.css"
import { useWhisperDB } from "@/contexts/WhisperDBContext"

const ChooseGroupMembers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    
    const { dbRef } = useWhisperDB()
    
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await dbRef.current.getChats()
                setAllUsers(response)
            } catch (error) {
                console.log(error)
            }
        }
        getAllUsers()
    }, [dbRef])

    const handleCheckboxChange = (user) => {
        console.log(user)
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.some((localUser) => localUser.othersId === user.othersId)
                ? prevSelectedUsers.filter((localUser) => localUser.othersId !== user.othersId)
                : [...prevSelectedUsers, user]
        )
    }

    const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return ( 
        <div className="choose-users-group">
            <input
                type="text"
                className="search-bar"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />        
            <div className="user-list">
                {filteredUsers?.map((user) => (
                    <div key={user.id} className="user-item">
                        <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedUsers.some((localUser) => localUser.othersId === user.othersId)}
                            onChange={() => handleCheckboxChange(user)}
                        />
                        <div className="user-image">
                            <img src={user.profilePic} alt={user.name} />
                        </div>
                        <label htmlFor={`user-${user.id}`}>{user.name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default ChooseGroupMembers;