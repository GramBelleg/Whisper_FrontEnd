import WhisperDB from '@/services/indexedDB/whisperDB';
import { createContext, useContext, useEffect, useRef } from 'react';



// Create the context
const WhisperDBContext = createContext(null);

// Create a provider component
export const WhisperDBProvider = ({ children }) => {
    const dbRef = useRef(null);

    const initDB = async () => {
            
        try {
            if(dbRef.current === null) { 
                const whisperDB = new WhisperDB();
                await whisperDB.init();
                dbRef.current = whisperDB;
                console.log('Database initialized');
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    };

    return (
        <WhisperDBContext.Provider value={{dbRef, initDB}}>
            {children}
        </WhisperDBContext.Provider>
    );
};

// Custom hook for easy usage
export const useWhisperDB = () => {
    return useContext(WhisperDBContext);
};
