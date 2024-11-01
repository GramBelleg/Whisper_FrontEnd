// This is just for testing
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import '../SampleHome/SampleHome.css'
import { ModalProvider } from '@/contexts/ModalContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '../Sidebar/Sidebar'
import { useState } from 'react'

const SampleHome = () => {
    const [showSettings, setShowSettings] = useState(false);

    const toggleProfileSettings = () => {
        console.log('toggleProfileSettings');
        setShowSettings((prev) => !prev); 
    };

    return (
        <ChatProvider>
            <ModalProvider>
                <div className='sampleHome'>
                    <SidebarProvider>
                        <div className='buttons-bar-container'>
                            <ButtonsBar toggleProfileSettings={toggleProfileSettings} />
                        </div>
                        <Sidebar showSettings={showSettings} />
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
