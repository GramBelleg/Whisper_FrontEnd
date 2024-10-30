// This is just for testing
import ChatPage from '../ChatPage/ChatPage'
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import '../SampleHome/SampleHome.css'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import useFetch from '../../services/useFetch'
import { ModalProvider } from '@/contexts/ModalContext'
import { ChatProvider } from '@/contexts/ChatContext';

const SampleHome = () => {
    const { data: chatList, error: errorChats, loading: loadingChats } = useFetch('/chats')


    return (
        <ChatProvider>
            <ModalProvider>
                <div className='sampleHome'>
                    <div className='buttons-bar-container'>
                        <ButtonsBar />
                    </div>
                    <div className='chatpage-container'>{!loadingChats && <ChatPage chatList={chatList} />}</div>
                    <div className='chatting'>
                        <SingleChatSection/>
                    </div>
                </div>
            </ModalProvider>
        </ChatProvider>
    )
}

export default SampleHome
