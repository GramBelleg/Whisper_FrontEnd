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
                const response = await dbRef.current.getUsers()
                console.log("Users", response)
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
            prevSelectedUsers.some((localUser) => localUser.id === user.id)
                ? prevSelectedUsers.filter((localUser) => localUser.id !== user.id)
                : [...prevSelectedUsers, user]
        )
    }

    const filteredUsers = allUsers?.filter((user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
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
                            checked={selectedUsers.some((localUser) => localUser.id === user.id)}
                            onChange={() => handleCheckboxChange(user)}
                        />
                        <div className="user-image">
                            <img src={user.profilePic} alt={user.userName} />
                        </div>
                        <label htmlFor={`user-${user.id}`}>{user.userName}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default ChooseGroupMembers;