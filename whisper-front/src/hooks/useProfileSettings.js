import { useEffect, useState } from 'react';
import { useProfileContext } from '@/contexts/ProfileSettingsContext';
import { getProfilePic } from '@/services/profileServices/ProfileSettingsService';

export const useProfileSettings = () => {
  const { profilePic, setProfilePic } = useProfileContext();
  const { error, setError } = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        setError(null);
        const profilePicUrl = await getProfilePic();
        setProfilePic(profilePicUrl);
      } catch (err) {
        setError(err);
        console.error('Error fetching profile picture:', err);
      }
    };

    fetchProfilePic();
  }, [setProfilePic]);

  return { profilePic, error };
};
