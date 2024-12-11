// This is just for testing
import './Home.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import './Home.css'
import { ModalProvider } from '@/contexts/ModalContext'
import Sidebar from '../Sidebar/Sidebar'

const Home = () => {
    return (
        <ModalProvider>
            <div className='Home'>
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

export default Home
