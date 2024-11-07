import { useEffect, useState } from 'react';
import { useProfileContext } from '@/contexts/ProfileSettingsContext';
import { getProfilePic, sendUpdateCode, updateBio,
     updateProfilePic,
     updateEmail, updateName, updatePhone, updateUserName } from '@/services/profileServices/ProfileSettingsService';
import useAuth from './useAuth';

export const useProfileSettings = () => {
    const { profilePic, setProfilePic } = useProfileContext();
    const [errors, setErrors] = useState({ bio: null, name: null, userName: null, profilePic: null });
    const { handleUpdateUser } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        const fetchProfilePic = async () => {
            try {
                setErrors(prevErrors => ({ ...prevErrors, profilePic: null })); 
                console.log("will call getProfilePic from service")
                setLoading(true);
                const profilePicUrl = await getProfilePic();
                setProfilePic(profilePicUrl);
            } catch (err) {
                setErrors(prevErrors => ({ ...prevErrors, profilePic: 'Error fetching profile picture.' }));
                console.error('Error fetching profile picture:', err);
            }
            finally{
                setLoading(false);
            }
        };
        if (!profilePic)
        {
        fetchProfilePic();
        console.log("fetching profile pic")
        }
    }, [setProfilePic]);

    const handleBioUpdate = async (newBio) => {
        try {
            setErrors(prevErrors => ({ ...prevErrors, bio: null }));
            const response = await updateBio(newBio);
            handleUpdateUser('bio', newBio);
            return response;
        } catch (err) {
            setErrors(prevErrors => ({ ...prevErrors, bio: err.message || 'Error updating bio.' }));
            console.error('Error updating bio:', err);
        }
    };

    const handleNameUpdate = async (newName) => {
      const nameRegex = /^(?! )[a-zA-Z\p{L}\s]+(?<! )$/u;
      const consecutiveSpacesRegex = /^(?!.*\s{2,})/;
  
      if (!nameRegex.test(newName)) {
          setErrors(prevErrors => ({
              ...prevErrors,
              name: "Name can only contain letters and spaces, without starting or ending spaces."
          }));
          throw new Error;
      }
  
      if (!consecutiveSpacesRegex.test(newName)) {
          setErrors(prevErrors => ({
              ...prevErrors,
              name: "Name cannot contain consecutive spaces."
          }));
          throw new Error;
      }
  
      try {
          setErrors(prevErrors => ({ ...prevErrors, name: null }));
          const response = await updateName(newName);
          handleUpdateUser('name', newName);
          return response;
      } catch (err) {
          setErrors(prevErrors => ({
              ...prevErrors,
              name: err.message || 'Error updating name.'
          }));
          console.error('Error updating name:', err);
      }
  };
  

    const handleUserNameUpdate = async (newUserName) => {
        try {
            setErrors(prevErrors => ({ ...prevErrors, userName: null }));
            const response = await updateUserName(newUserName);
            handleUpdateUser('userName', newUserName);
            return response;
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(prevErrors => ({ ...prevErrors, userName: err.response.data.message || 'An error occurred' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, userName: 'An unexpected error occurred' }));
            }
            throw err;
        }
    };

    const handlePhoneUpdate = async (newPhoneNumber) => {
      try {
          console.log(newPhoneNumber)
          setErrors(prevErrors => ({ ...prevErrors, phoneNumber: null }));
          const response = await updatePhone(newPhoneNumber);
          handleUpdateUser('phoneNumber', newPhoneNumber);
          return response;
      } catch (err) {
          if (err.response && err.response.data) {
              setErrors(prevErrors => ({ ...prevErrors, phoneNumber: err.response.data.message || 'An error occurred' }));
          } else {
              setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'An unexpected error occurred' }));
          }
          throw err;
      }
  };

  const handleSendUpdateCode = async (newEmail) => {
    try {
        setErrors(prevErrors => ({ ...prevErrors, email: null }));

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            throw new Error('Invalid email format');
        }

        const response = await sendUpdateCode(newEmail);
        return response;
    } catch (err) {
        if (err.message === 'Invalid email format') {
            setErrors(prevErrors => ({ ...prevErrors, email: err.message }));
        } else if (err.response && err.response.data) {
            setErrors(prevErrors => ({ ...prevErrors, email: err.response.data.message || 'An error occurred' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: 'An unexpected error occurred' }));
        }
        throw err;
    }
};

const handleResendUpdateCode = async (newEmail) => {
    try {
        const response = await sendUpdateCode(newEmail);
        return response;
    } catch (err) {
        if (err.response && err.response.data) {
            setErrors(prevErrors => ({ ...prevErrors, email: err.response.data.message || 'An error occurred' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: 'An unexpected error occurred' }));
        }
        throw err;
    }
};

const handleEmailUpdate = async (newEmail,code) => {
  try {
      setErrors(prevErrors => ({ ...prevErrors, verifyCode: null }));
      const response = await updateEmail(newEmail,code);
      handleUpdateUser('email', newEmail);
      return response;
  } catch (err) {
      if (err.response && err.response.data) {
          setErrors(prevErrors => ({ ...prevErrors, verifyCode: err.response.data.message || 'An error occurred' }));
      } else {
          setErrors(prevErrors => ({ ...prevErrors, verifyCode: 'An unexpected error occurred' }));
      }
      throw err;
  }
};
const handleProfilePicUpdate = async (newProfilePic) => {
    try {
        setErrors(prevErrors => ({ ...prevErrors, profilePic: null }));
        console.log("will call updateProfilePic from service")
        setLoading(true);
        const response = await updateProfilePic(newProfilePic);
        const updatedProfilePic = await getProfilePic(); 
        setProfilePic(updatedProfilePic);
        return response;
    } catch (err) {
        if (err.response && err.response.data) {
            setErrors(prevErrors => ({ ...prevErrors, profilePic: err.response.data.message || 'An error occurred' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, profilePic: 'An unexpected error occurred' }));
        }
        throw err;
    }
    finally{
        setLoading(false);
    }
};


const clearError = (id) =>{
  setErrors(prevErrors => ({ ...prevErrors, [id]: null}));
}



    return { profilePic, setProfilePic, errors, loading,
         handleBioUpdate, handleNameUpdate, handleUserNameUpdate,
          handlePhoneUpdate, handleEmailUpdate, handleSendUpdateCode,
           handleResendUpdateCode, clearError, handleProfilePicUpdate,
         };
};
