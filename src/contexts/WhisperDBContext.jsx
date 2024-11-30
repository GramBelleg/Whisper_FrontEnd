import WhisperDB from '@/services/indexedDB/whisperDB';
import React, { createContext, useContext, useEffect, useState } from 'react';



// Create the context
const WhisperDBContext = createContext(null);

// Create a provider component
export const WhisperDBProvider = ({ children }) => {
    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDB = async () => {
            const whisperDB = new WhisperDB();
            try {
                await whisperDB.init();
                setDb(whisperDB);
                console.log('Database initialized');
            } catch (error) {
                console.error('Failed to initialize database:', error);
            }
        };

        initDB();
    }, []);

    return (
        <WhisperDBContext.Provider value={{db}}>
            {children}
        </WhisperDBContext.Provider>
    );
};

// Custom hook for easy usage
export const useWhisperDB = () => {
    const context = useContext(WhisperDBContext);
    if (!context) {
        throw new Error('useWhisperDB must be used within a WhisperDBProvider');
    }
    return context;
};
