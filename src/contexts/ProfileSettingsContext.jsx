import { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const ProfileSettingsProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(null);

  return (
    <ProfileContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};
