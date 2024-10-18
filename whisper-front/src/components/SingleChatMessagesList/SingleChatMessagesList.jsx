
import useFetch from "../../services/useFetch";
import ChattingTextMessage from "../ChattingTextMessage/ChattingTextMessage";
import "./SingleChatMessagesList.css"


const SingleChatMessagesList = ({ user }) => {


    // TODO: the user should have the name of the other side I am contacting
    const {data: messages, loading, error} = useFetch('/userMessages');

    return ( 
        <div className="single-chat-messages-list">
            {
                messages?.map((message, index) => (
                        <ChattingTextMessage key={index} message={message}/>
                    )
                )
            }
        </div>
    );
}
 
export default SingleChatMessagesList;