import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useWhisperDB } from './WhisperDBContext'


export const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
    const { dbRef } = useWhisperDB()
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await dbRef.current.getUsers()
                setAllUsers(users)
            } catch (error) {
                console.error(error)
            }
        }

        loadUsers()
    }, [])
    return (
        <GroupContext.Provider
            value={{
                allUsers
            }}
        >
            {children}
        </GroupContext.Provider>
    )
}

export const useGroup = () => {
    return useContext(GroupContext)
}
