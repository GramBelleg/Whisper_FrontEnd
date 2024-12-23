import ChatSettingsContainer from "../ChatSettings/ChatSettingsContainer";
import { useChat } from "@/contexts/ChatContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import { useState, useEffect } from "react";
import ChatInfo from "./ChatInfo";
import GroupAddMembers from "../GroupAddMembers/GroupAddMembers";
const ChatInfoContainer = ({currentChat, onClose}) => {

    const [isVisible, setIsVisible] = useState(false);
    const {handleGetChannelSettings} = useChat();
    const [channelInvite,setChannelInvite] = useState("http://ayhaga:5173/")
    const { push } = useStackedNavigation()

    const handleClose = () => {
        setIsVisible(false); 
        setTimeout(() => {
            onClose(); 
        }, 300); 
    };

    useEffect(() => {
        setIsVisible(true); 
        const getChannelInvite = async () => {
            try {
                const response = await handleGetChannelSettings()
                setChannelInvite(response.inviteLink)
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }
        if(currentChat.type === "CHANNEL")
            getChannelInvite()
    }, [currentChat]);
    const handleAddUsers = () => {
        push(<GroupAddMembers type={currentChat?.type === 'GROUP' ? 'group' : 'channel'} />);    
    }
    
    const handleEdit = () => {
        push( <ChatSettingsContainer chatType={currentChat?.type === 'GROUP' ? 'group' : 'channel'} /> )
    }
    return (
        <ChatInfo 
            currentChat={currentChat}
            handleAddUsers={handleAddUsers}
            handleEdit={handleEdit}
            channelInvite={channelInvite}
            isVisible={isVisible}
            handleClose={handleClose}
            type={currentChat?.type === 'GROUP' ? 'group' : 'channel'} />
      );
}
 
export default ChatInfoContainer;