// This is just for testing
import ChatPage from "../ChatPage/ChatPage";
import "../SampleHome/SampleHome.css"


const SampleHome = () => {
    return ( 
        <div className="sampleHome">
            <div className="side-bar-container">
                Hello
            </div>
            <div className="chat-page-container">
                <ChatPage/>
            </div>
            <div className="chatting">
               
            </div>
        </div>
    );
}
 
export default SampleHome;