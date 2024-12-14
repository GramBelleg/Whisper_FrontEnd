import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
    const [activePage, setActivePage] = useState('chat')
    const [type, setType] = useState("")

    const value = {
        activePage,
        type,
        setType,
        setActivePage
    }

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
