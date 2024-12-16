// This is just for testing
import './Home.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './Home.css'
import { ModalProvider } from '@/contexts/ModalContext'
import Sidebar from '../Sidebar/Sidebar'
import { VoiceCallProvider } from '@/contexts/VoiceCallContext'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

const Home = () => {

    AgoraRTC.setLogLevel(3)
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    
    
    return (
        <ModalProvider>
            <AgoraRTCProvider client={agoraClient}>
                <VoiceCallProvider>
                    <div className='Home'>
                        <div className='buttons-bar-container'>
                            <ButtonsBar />
                        </div>
                        <Sidebar />
                        <div className='chatting'>
                            <SingleChatSection />
                        </div>
                    </div>
                </VoiceCallProvider>
            </AgoraRTCProvider>
        </ModalProvider>
    )
}

export default Home
