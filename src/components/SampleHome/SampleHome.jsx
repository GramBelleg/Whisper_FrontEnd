// This is just for testing
import './SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './SampleHome.css'
import { ModalProvider } from '@/contexts/ModalContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '../Sidebar/Sidebar'
import { useWhisperDB, WhisperDBProvider } from '@/contexts/WhisperDBContext'

const SampleHome = () => {

    
    
    return (
        <ChatProvider>
            <ModalProvider>
                    <div className='sampleHome'>
                        <SidebarProvider>
                            <div className='buttons-bar-container'>
                                <ButtonsBar />
                            </div>
                            <Sidebar/>
                        </SidebarProvider>
                        <div className='chatting'>
                            <SingleChatSection />
                        </div>
                    </div>
            </ModalProvider>
        </ChatProvider>
    )
}

export default SampleHome
