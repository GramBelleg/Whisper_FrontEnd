import LoadingData from '@/components/LoadingData/LoadingData'
import WhisperDB from '@/services/indexedDB/whisperDB'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

// Create the context
const WhisperDBContext = createContext(null)

// Create a provider component
export const WhisperDBProvider = ({ children }) => {
    const dbRef = useRef(null)
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initDB = async () => {
            try {
                if (dbRef.current === null) {
                    const whisperDB = WhisperDB.getInstance()
                    await whisperDB.init()
                    dbRef.current = whisperDB
                    setIsInitialized(true)
                }
            } catch (error) {
                console.error('Failed to initialize database:', error)
            }
        }
        initDB()
    }, [])

    if (!isInitialized) {
        return <LoadingData />
    }



    return <WhisperDBContext.Provider value={{ dbRef }}>{children}</WhisperDBContext.Provider>
}

// Custom hook for easy usage
export const useWhisperDB = () => {
    return useContext(WhisperDBContext)
}
