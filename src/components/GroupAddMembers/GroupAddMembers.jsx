import React, { useEffect, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWhisperDB } from "@/contexts/WhisperDBContext";
import ChooseGroupMembers from "../ChooseGroupMembers/ChooseGroupMembers";

const GroupAddMembers = ({type}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [canBeAddedUsers, setCanBeAddedUsers] = useState(0);
  const { handleGetMembers, addUser } = useChat();
  const { dbRef } = useWhisperDB();
  const { pop } = useStackedNavigation();

  useEffect(() => {
    const getGroupMembers = async () => {
        try {
            const groupMembers = await handleGetMembers()
            const allUsers = await dbRef.current.getUsers()
            setCurrentMembers(groupMembers)
            setAllUsers(allUsers)
            const canBeAdded = allUsers.filter(user => !groupMembers.some(member => member.id === user.id))
            setCanBeAddedUsers(canBeAdded)
        } catch (error) {
            console.error('Error fetching members:', error)
        }
     }
        if(canBeAddedUsers === 0)
        {
            getGroupMembers()
        }
    
     }, [canBeAddedUsers])

  const handleAddUsers = async () => {
    try {
      for (const user of selectedUsers) {
        await addUser(user);
      }
        pop(); 
    } catch (error) {
      console.error('Error adding new members:', error);
    }
  };

  return (
    <div className="fixed top-[2.5%] right-[4.5%] w-80 h-full bg-dark text-light shadow-xl z-100 p-4 transition-transform transform translate-x-0">
      <div className="flex justify-between items-center space-x-4 mb-4">
        <div onClick={() => pop()} id="back" data-testid="back">
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <h2 className="text-lg font-bold flex-grow text-center">Add {(type === "group")? "Members" :"Subscribers"}</h2>
      </div>

      {
        canBeAddedUsers && <ChooseGroupMembers 
        selectedUsers={selectedUsers} 
        setSelectedUsers={setSelectedUsers} 
        Users={canBeAddedUsers}
      />
      }

        <div className="fixed bottom-10 left-0 right-0 px-4">
          <button 
          onClick={handleAddUsers}
          disabled={selectedUsers.length === 0}
          className="w-full bg-[var(--accent-color)] text-white py-2 rounded-t-lg absolute bottom-full left-0 right-0 mb-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default GroupAddMembers;