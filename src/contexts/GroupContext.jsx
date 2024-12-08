import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useWhisperDB } from './WhisperDBContext'
import useAuth from '@/hooks/useAuth'
import { useChat } from './ChatContext'

export const GroupContext = createContext()

export const ChatProvider = ({ children }) => {
    const { dbRef } = useWhisperDB()
    const { user } = useAuth()
    const { messagesSocket, currentChatRef } = useChat()

    return (
        <GroupContext.Provider
            value={{
                
            }}
        >
            {children}
        </GroupContext.Provider>
    )
}

export const useGroup = () => {
    return useContext(GroupContext)
}
