import CallSocket from '@/services/sockets/CallSocket'
import { getUserInfo } from '@/services/userservices/getUserInfo'
import { useJoin, useLocalMicrophoneTrack, usePublish, useRemoteUsers, useRTCClient } from 'agora-rtc-react'
import React, { createContext, useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useChatEncryption from '@/hooks/useChatEncryption'
import { useWhisperDB } from './WhisperDBContext'
import JoinCallModal from '@/components/Modals/JoinCallModal/JoinCallModal'
import { joinVoiceCall } from '@/services/voiceCall/joinCall'
import { leaveVoiceCall } from '@/services/voiceCall/leaveVoiceCall'

export const VoiceCallContext = createContext()

export function VoiceCallProvider({ children }) {
    
    const [inCall, setInCall] = useState(false)
    const [callChatId, setCallChatId] = useState(null)
    const [channel, setChannel] = useState("")
    const [token, setToken] = useState('')
    const [userJoined, setUserJoined] = useState(false)
    const [showJoinCallModal, setShowJoinCallModal] = useState(false)
    const [joinModalContent, setJoinModalContent] = useState(null)
    const callSocket = new CallSocket();
    
    const {dbRef} = useWhisperDB();
    const {user:authUser} = useAuth();
    const client = useRTCClient();
    
      const remoteUsers = useRemoteUsers();
      const [isMuted, setIsMuted] = useState(false);
      const { localMicrophoneTrack } = useLocalMicrophoneTrack(!isMuted);
      const [usersInfo, setUsersInfo] = useState([]);
      const [localVolume, setLocalVolume] = useState(100);
      const [remoteVolumes, setRemoteVolumes] = useState({});
    
      useEffect(() => {
        if (localMicrophoneTrack) {
          localMicrophoneTrack.setVolume(localVolume);
        }
      }, [localVolume, localMicrophoneTrack]);
    
      useEffect(() => {
        const enableLocalTrack = async () => {
            if (localMicrophoneTrack) {
                await localMicrophoneTrack.setEnabled(!isMuted);
            }
        }
        enableLocalTrack();
      }, [isMuted, localMicrophoneTrack]);
    
      const { isLoading: isJoiningCall, isConnected } = useJoin({
        appid: import.meta.env.VITE_APP_AGORA_APP_ID,
        channel: channel,
        token: token || null,
        uid: authUser.id,
      },inCall, client);
    
      usePublish([localMicrophoneTrack]);
    
      const toggleMute = () => {
        setIsMuted(!isMuted);
      };
    
      const adjustLocalVolume = (volume) => {
        setLocalVolume(parseInt(volume, 10));
      };
    
      const adjustRemoteVolume = (uid, volume) => {
        const remoteUser = remoteUsers.find((user) => user.uid === uid);
        if (remoteUser && remoteUser.audioTrack && remoteUser.hasAudio) {
          remoteUser.audioTrack.setVolume(volume);
          let newVolume = parseInt(volume, 10)
          console.log('volume',volume)
          console.log('newVolume',newVolume)
          setRemoteVolumes((prev) => ({
            ...prev,
            [uid]: newVolume,
          }));
        }
      };

      const muteRemoteUser = (uid) => {
        const remoteUser = remoteUsers.find((user) => user.uid === uid);
        if (remoteUser && remoteUser.audioTrack) {
          remoteUser.audioTrack.setEnabled(false);
        }
      }
    
      const leaveCall = async () => {
        try {
          if (localMicrophoneTrack) {
            await client.unpublish(localMicrophoneTrack);
            localMicrophoneTrack.close();
          }
          await client.leave();
          console.log('Left the call successfully');
        } catch (error) {
          console.error('Error leaving call:', error);
        }
      };

    useEffect(() => {
      const listenForLeaveChannel = async () => {
        if(remoteUsers.length > 0){
            setUserJoined(true)
        } else if(remoteUsers.length == 0 && userJoined){
          // then the user left the call
          await endCall(true);
        }
      }
        const fetchUsers = async () => {
            const users = await Promise.all(remoteUsers.map(async (user) => {
                const info = await getUserInfo(user.uid);
                return {
                    uid: user.uid,
                    name: info.userName,
                }
            }))

            const usersInfoObject = users.reduce((acc, user) => {
                acc[user.uid] = user;
                return acc;
            }, {});

            setUsersInfo(usersInfoObject);
        }

        
        
        listenForLeaveChannel();
        fetchUsers();
    }, [remoteUsers])
    

    const startCall = (_chatId, _token, secretKey = "") => {
      console.log('secretKey',secretKey)
        setChannel(`chat-${_chatId}`)  
        setToken(_token)
        setCallChatId(_chatId)
        if(secretKey.length > 0){
            client.setEncryptionConfig('aes-128-gcm',secretKey);
        }
        setInCall(true)
    }



    
    const endCall = async (executeAfterEndCall = false) => {
      console.log('endCall')
        await leaveCall()
        setInCall(false)
        setToken('')
        setUserJoined(false)
        if(executeAfterEndCall){
          await afterEndCall(callChatId);
        }
        setCallChatId(null)
    }

    const afterEndCall = async (chatId) => {
      await leaveVoiceCall(chatId, "JOINED");
  }

    


      const {getVoiceCallSymmetricKey} = useChatEncryption()


      const joinCall = async (token, chat) => {
        console.log('joinCall,chat',chat)
        let symmetricKey = "";
        if(chat.type == "DM") {
          symmetricKey = await getVoiceCallSymmetricKey(chat);
        }
        await joinVoiceCall(chat.id); 
        startCall(chat.id, token, symmetricKey);
      }

      const rejectCall = async (chat) => {
        await leaveVoiceCall(chat.id, "CANCELED");
      }

      const handleReceiveRejection = async (data) => {
        if(data.chatId == callChatId && inCall){
          await endCall();
        }
      }

      const handleReceiveCall = async(data) => {
        if(data.chatId == callChatId && inCall){
          return;
        }


        const chat = await dbRef.current.getChat(parseInt(data.chatId));

        setJoinModalContent(<JoinCallModal 
            userName={data.userName} 
            onAccept={async () => {
              await joinCall(data.token, chat)
              setShowJoinCallModal(false)
            }} 
            onReject={async () => {
              await rejectCall(chat)
              setShowJoinCallModal(false);
            }}
          />);

        setShowJoinCallModal(true);
      }


      useEffect(() => {
        callSocket.onReceiveCall(handleReceiveCall)
        callSocket.onReceiveRejection(handleReceiveRejection)
        return () => {
          callSocket.offReceiveCall(handleReceiveCall)
          callSocket.offReceiveRejection(handleReceiveRejection)
        }
      },[callSocket, handleReceiveRejection, handleReceiveCall])

    const value = {
        inCall,
        token,
        channel,
        startCall,
        endCall,
        toggleMute,
        adjustLocalVolume,
        adjustRemoteVolume,
        remoteVolumes,
        localMicrophoneTrack,
        muteRemoteUser,
        isJoiningCall,
        isConnected,
        isMuted,
        usersInfo,
        remoteUsers
    }

    return (
        <VoiceCallContext.Provider value={value}>
            {children}
            {showJoinCallModal && (
              <>
                {joinModalContent}
              </>
            )}
        </VoiceCallContext.Provider>
        
    )
}

