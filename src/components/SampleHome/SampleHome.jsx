// This is just for testing
import './SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './SampleHome.css'
import { ModalProvider } from '@/contexts/ModalContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '../Sidebar/Sidebar'

const SampleHome = () => {
    return (
            <ModalProvider>
                <div className='sampleHome'>
                    
                        <div className='buttons-bar-container'>
                            <ButtonsBar />
                        </div>
                        <Sidebar />
                    <div className='chatting'>
                        <SingleChatSection />
                    </div>
                </div>
            </ModalProvider>
    )
}

export default SampleHome
