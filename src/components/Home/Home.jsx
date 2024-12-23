// This is just for testing
import './Home.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './Home.css'
import { ModalProvider } from '@/contexts/ModalContext'
import Sidebar from '../Sidebar/Sidebar'
import { VoiceCallProvider } from '@/contexts/VoiceCallContext'

const Home = () => {

    return (
        <ModalProvider>
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
        </ModalProvider>
    )
}

export default Home
