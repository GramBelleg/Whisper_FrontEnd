import useAuth from "@/hooks/useAuth";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CallLog = ({message}) => {

const {user} = useAuth();
    return (
        <div className="flex flex-col gap-1">
            <h3 className={`flex w-full justify-center items-center gap-2 ${message.senderId === user.userId ? 'text-white' : 'text-red-500'}`}>
                <FontAwesomeIcon style={{height:'18px'}} icon={message.senderId === user.userId ? faArrowUp : faArrowDown} />
                <span className="text-xl">{message.senderId === user.userId ? 'Outgoingcall' : 'Ingoingcall'}</span>
            </h3>
            <div>
                {message.content}
            </div>
        </div>
    );
}

export default CallLog;