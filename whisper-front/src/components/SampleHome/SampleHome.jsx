// This is just for testing
import ChatPage from "../ChatPage/ChatPage";
import "../SampleHome/SampleHome.css"
import ButtonsBar from "../ButtonsBar/ButtonsBar";


const SampleHome = () => {
    return ( 
        <div className="sampleHome">
            <ButtonsBar />
            { true && <ChatPage/>}

            {/* <div className="side-bar-container">
                <ButtonsBar />
            </div>
            <div className="chat-page-container">
                { true && <ChatPage/>}
            </div>
            <div className="chatting">
               
            </div> */}
        </div>
    );
}
 
export default SampleHome;