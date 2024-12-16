// This is just for testing
import './SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './SampleHome.css'
import { ModalProvider } from '@/contexts/ModalContext'
import { VoiceCallProvider } from '@/contexts/VoiceCallContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '../Sidebar/Sidebar'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

const SampleHome = () => {

    AgoraRTC.setLogLevel(3)
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    

    return (
        <ModalProvider>
        <AgoraRTCProvider client={agoraClient}>
            <VoiceCallProvider>
                
                    <div className='sampleHome'>
                        <SidebarProvider>
                            <div className='buttons-bar-container'>
                                <ButtonsBar />
                            </div>
                            <Sidebar />
                        </SidebarProvider>
                        <div className='chatting'>
                            <SingleChatSection />
                        </div>
                    </div>
            </VoiceCallProvider>
        </AgoraRTCProvider>
        </ModalProvider>
    )
}

export default SampleHome
