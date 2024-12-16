import { useContext } from 'react'
import { VoiceCallContext } from '../contexts/VoiceCallContext'

const useVoiceCall = () => {
    return useContext(VoiceCallContext)
}

export default useVoiceCall
