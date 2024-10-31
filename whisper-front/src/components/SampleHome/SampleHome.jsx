// This is just for testing
import ChatPage from '../ChatPage/ChatPage'
import '../SampleHome/SampleHome.css'
import SingleChatSection from '../SingleChatSection/SingleChatSection'
import ButtonsBar from '../ButtonsBar/ButtonsBar'
import { useEffect, useState } from 'react'
import '../SampleHome/SampleHome.css'
import { ModalProvider } from '@/contexts/ModalContext'
import { ChatProvider } from '@/contexts/ChatContext';
import { getChatsAPI, getChatsCleaned } from '@/services/chatservice/getChats'


const SampleHome = () => {

    const [chatList, setChatList] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);


    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        let allChats = await getChatsCleaned();
        setChatList(allChats);
        setLoadingChats(false);
        console.log(allChats)
    }
        

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
