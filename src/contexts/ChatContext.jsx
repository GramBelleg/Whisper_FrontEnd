import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { mapMessage } from '@/services/chatservice/getMessagesForChat'
import MessagingSocket from '@/services/sockets/MessagingSocket'
import { useWhisperDB } from './WhisperDBContext'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import useChatEncryption from '@/hooks/useChatEncryption'
import useAuth from '@/hooks/useAuth'
import ChatSocket from '@/services/sockets/ChatSocket'
import { cleanChat } from '@/services/chatservice/getChats'
import apiUrl from '@/config'
import { useSidebar } from './SidebarContext'
import { getMembers } from '@/services/chatservice/getChatMembers'
import { muteChat, unMuteChat } from '@/services/chatservice/muteUnmuteChat'
import { getGroupSettings, setPrivacy } from '@/services/chatservice/groupSettings'
import { setGroupLimit } from '@/services/chatservice/groupSettings'
import { getChannelSettings } from '@/services/chatservice/channelSettings'


export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [pinnedMessages, setPinnedMessages] = useState([])
    const [parentMessage, setParentMessage] = useState(null)
    const [sending, setSending] = useState(false)
    const messagesSocket = new MessagingSocket()
    const chatSocket = new ChatSocket()
    const { dbRef } = useWhisperDB()
    const currentChatRef = useRef(currentChat)
    const [messageReceived, setMessageReceived] = useState(false)
    const { encryptMessage , decryptMessage }  = useChatEncryption()
    const { user } = useAuth()
    const [reloadChats, SetReloadChats] = useState(false)
    const { generateKeyIfNotExists } = useChatEncryption()
    const { setActivePage } = useSidebar()
    const [chatAltered, setChatAltered] = useState(false)
    const [isThreadOpenned, setIsThreadOpenned] = useState(false)
    const [threadMessage, setThreadMessage] = useState(null)


    const selectChat = (chat) => {
        setCurrentChat(chat)
        setIsThreadOpenned(false)
        setThreadMessage(null)
        setParentMessage(null)
    }

    const loadMessages = async (id) => {
        try {
            const myMessages = await dbRef.current.getMessagesForChat(id)
            myMessages.map(async (message) => {
                if(message.isAnnouncement && !message.isPinned)
                {
                    pinMessage(message.id)
                }
            })
            setMessages(myMessages)
        } catch (error) {
            console.log(error)
        }
    }

    const loadPinnedMessages = async (id) => {
        try {
            const myPinnedMessages = await dbRef.current.getPinnedMessagesForChat(id)
            setPinnedMessages(myPinnedMessages)
        } catch (error) {
            console.log(error)
        }
    }

    const clearUnreadMessages = async (id) => {
        try {
            await dbRef.current.updateUnreadCount(id, false)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (currentChat) {
            try {
                messagesSocket.readAllMessages(currentChat.id)
            } catch (error) {
                console.log(error)
            }
            loadMessages(currentChat.id)
            clearUnreadMessages(currentChat.id)
            loadPinnedMessages(currentChat.id)
            
        } else {
            setMessages([])
            setPinnedMessages([])
        }
        currentChatRef.current = currentChat
    }, [currentChat])

    const updateMessage = async (messageId, content) => {
        let finalContent = content;
        if (currentChat.type === 'DM') {
            finalContent = await encryptMessage(content, currentChat)
        }
        messagesSocket.updateData({
            chatId: currentChat.id,
            id: messageId,
            content: finalContent
        })
    }

    const deleteMessage = async (messageId) => {
        messagesSocket.deleteMessage({
            chatId: currentChat.id,
            messages: [messageId]
        })
    }
    
    const sendJoinChat = async (chat, keyId) => {
        sendMessage({
            content: keyId.toString(),
            type: "EVENT",
        },chat);
    }

    const sendMessage = async (data, chat = null) => {
        setSending(true);
        const newMessage = {
            chatId: chat ? chat.id : currentChat.id,
            forwarded: false,
            selfDestruct: true,
            expiresAfter: 5,
            sentAt: new Date().toISOString(),
            media: '',
            extension: '',
            parentMessageId: null,
            forwardedFromUserId: null,
            mentions: [],
            isSecret: false,
            size: null,
            ...data
        }

        if (parentMessage && parentMessage.relationship === parentRelationshipTypes.REPLY) {
            newMessage.parentMessageId = parentMessage.id
        }

        const newMessageForBackend = { ...newMessage }

        if (!chat && currentChat && currentChat.type === 'DM') {
            newMessage.isSecret = true
            newMessageForBackend.isSecret = true
            newMessageForBackend.content = await encryptMessage(newMessage.content, currentChat)
        }

        newMessage.senderId = user.userId
        newMessage.deliveredAt = ''
        newMessage.readAt = ''
        newMessage.deleted = false
        newMessage.sender = user.name
        newMessage.state = 4
        newMessage.time = new Date()

        try {
            messagesSocket.sendData(newMessageForBackend)
            if(!chat) {
                setMessages((prevMessages) => {
                    if (prevMessages) {
                        return [{ id: Date.now(), ...newMessage }, ...prevMessages]
                    }
                    return [newMessage]
                })
                setParentMessage(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
            if(newMessage.isAnnouncement)
            {
               //TODO: pin the message that is just sent
            }
        }
    }

    const updateParentMessage = (message, relationship) => {
        setParentMessage({ relationship, ...message })
    }

    const clearParentMessage = () => {
        setParentMessage(null)
    }

    const removeFromChat = (incomingUser) => {
        try {
            const toSend = {
                user: {
                    id: incomingUser.id,
                    userName: incomingUser.userName
                },
                chatId: currentChat.id
            }
            chatSocket.removeFromChat(toSend)
        } catch (error) {
            console.error(error)
        }
    }

    const addAdmin = (userId) => {
        try {
            const toSend = {
                userId:userId,
                chatId: currentChat.id,
            }

            chatSocket.addAdmin(toSend)
        } catch (error) {
            console.error(error)
        }
    }
    const addUser = (user) => {
        try {
            console.log("User",user)
            const UserData = {
                id: user.id,
                userName: user.userName,
                ProfilePic: user.profilePic
            }
            const toSend = {
                user:UserData,
                chatId: currentChat.id,
            }
            console.log("toSend",toSend)
            chatSocket.addUser(toSend)
        } catch (error) {
            console.error(error)
        }
    }

    const handleReceiveRemoveFromChat = async (data) => {
        try {
            const userId = data.user.id
            const chatId = data.chatId
            if (userId === user.id) {
                await dbRef.current.removeChat(chatId)
                setCurrentChat(null)
                setThreadMessage(null)
                setIsThreadOpenned(false)
                SetReloadChats(true)
            }
            else { 
                await dbRef.current.removeChatMember(chatId, userId)
                setChatAltered(true)
            }
        } catch (error) {
            console.error(error)
        }
    }
            

    const handleReceiveAddAdmin = async (adminData) => {
        try {
            await dbRef.current.addGroupAdmin(adminData.chatId, adminData.userId)
            setChatAltered(true)
        } catch (error) {
            console.error(error)
        }
    }
    const handleReceiveAddUser = async (userData) => {
        try {
            console.log("userData",userData)
            const member = {
                id: userData.user.id,
                userName: userData.user.userName,
                profilePic: userData.user.ProfilePic,
                isAdmin: false,
                hasStory: false
            }
            console.log("member",member)
            await dbRef.current.addChatMember(userData.chatId,member)
            console.log("will reload")
            setChatAltered(true)
        } catch (error) {
            console.error(error)
        }
    }

    const handleReceiveDeleteChat = async (chatData) => {
        try {
            await dbRef.current.removeChat(chatData.chatId)
            if (currentChat && currentChat.id === chatData.chatId) {
                setCurrentChat(null)
                setThreadMessage(null)
                setIsThreadOpenned(false)
            }
            setChatAltered(true)
            SetReloadChats(true)
        } catch (error) {
            console.error(error)
        }
    }

    const searchChat = async (query) => {
        try {
            if (currentChat) {
                console.log("curretChat",currentChat)
                const response = await dbRef.current.getMessagesForChat(currentChat.id)
                const filteredMessages = response.filter((message) => message.content.toLowerCase().includes(query.toLowerCase()))
                return filteredMessages
            } else {
                throw new Error('No chat selected')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleMute = async (chatId, chatType, duration) => {
        try {
            await muteChat(chatId, {
                type: chatType,
                isMuted: true,
                duration: duration
            })

            try {
                await dbRef.current.muteNotifications(chatId)
            } catch (error) {
                console.error(error)
            }
            setChatAltered(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnMute = async (chatId, chatType) => { 
        try {
            await unMuteChat(chatId, {
                type: chatType,
                isMuted: false,
                duration: 0
            })

            try {
                await dbRef.current.unMuteNotifications(chatId)
            } catch (error) {
                console.error(error)
            }
            setChatAltered(true)
        } catch (error) {
            console.log(error)
        }
    }

    const pinMessage = (messsageId, durtaion = 0) => {
        messagesSocket.pinMessage({
            chatId: currentChat.id,
            id: messsageId
        })
    }

    const unPinMessage = (messsageId) => {
        messagesSocket.unPinMessage({
            chatId: currentChat.id,
            id: messsageId
        })
    }

    const leaveGroup = async (chatId) => {
        chatSocket.leaveGroup({
            chatId: chatId
        })
    }

    const handleGetGroupSettings = async () => {
        try {
            const res = await getGroupSettings(currentChat.id);
            return res;
        } catch (error) {
            console.log("error",error)
        }
    }

    const handleGetChannelSettings = async () => {
        try {
            const res = await getChannelSettings(currentChat.id);
            return res;
        } catch (error) {
            console.log("error",error)
        }
    }

    const saveGroupSettings = async (groupLimit, privacy) =>
    {
        try {
            if(privacy)
                await setPrivacy(currentChat.id, privacy)
            if(groupLimit)
                await setGroupLimit(currentChat.id, groupLimit)
        } catch (error) {
            console.log(error)
            throw new Error ("failed to update group settings")
        }
    }

    const handleGetMembers = async () => {
        try {
            const members = await dbRef.current.getChatMembers(currentChat.id)
            //const members = await getMembers(currentChat.id);
            console.log(members)
            return members;
        } catch (error) {
            console.log(error)
        }
    }

    const deleteChat = async (chatId) => {
        try {
            chatSocket.deleteChat({
                chatId: chatId
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleReceiveLeaveGroup = async (groupLeft) => {
        try {
            if (groupLeft.userName === user.userName) {
                await dbRef.current.removeChat(groupLeft.chatId)
                setCurrentChat(null)
                setThreadMessage(null)
                setIsThreadOpenned(false)
            }
            else {
                const members = await dbRef.current.getChatMembers(groupLeft.chatId)
                if (members) {
                    const filteredMember = members.filter((member) => 
                        member.userName === groupLeft.userName
                    )
                    await dbRef.current.removeChatMember(groupLeft.chatId, filteredMember[0].id)
                    setChatAltered(true)
                }
            }
            
            SetReloadChats(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChatCreate = async (chatData) => {
        try {
            let data = { ...chatData };
            if (chatData && chatData.type === "DM") {
                let keyId = await generateKeyIfNotExists(chatData);
                if (keyId) {
                    // then I am the second participant in the chat
                    if(!chatData.participantKeys[1]) chatData.participantKeys[1] = keyId;
                    if(!chatData.participantKeys[0]) chatData.participantKeys[0] = keyId;
                    await axios.put(`${apiUrl}/api/encrypt/${chatData.id}?keyId=${keyId}`, {
                        keyId: keyId,
                        userId: authUser.id
                    });
                    sendJoinChat(chatData, keyId);
                }
            }
            // otherwise I am the first participant in the chat how created the chat and I have the key already
            const newChat = await cleanChat({...data})
            if (newChat.type === "GROUP") {
                const members = await getMembers(newChat.id)
                const admin = members.filter((member) => member.isAdmin)[0]
                const isAdmin = admin.id === user.id 
                await dbRef.current.insertChat({...newChat, members: members, isAdmin: isAdmin})
            } else {
                await dbRef.current.insertChat({...newChat, members: [], isAdmin: false})
            }
            SetReloadChats(true)
            setActivePage("chat")
        } catch (error) {
            console.error(error);
        }
    };

    const handleReceiveMessage = async (messageData) => {
        try {
            const activeChat = currentChatRef.current
            const myMessageData = {
                ...messageData
            }
            const chat = await dbRef.current.getChat(myMessageData.chatId)

            if(myMessageData.type == "EVENT") {
                let participantKeys = chat.participantKeys;
                if(!participantKeys[1]) {
                    participantKeys[1] = parseInt(myMessageData.content);
                }

                if(!participantKeys[0]) {
                    participantKeys[0] = parseInt(myMessageData.content);
                }
                
                await dbRef.current.updateChat(myMessageData.chatId,{
                    participantKeys:participantKeys
                });
                if(activeChat && chat.id === activeChat.id) {
                    setCurrentChat({
                        ...chat,
                        participantKeys:participantKeys
                    })
                    setIsThreadOpenned(false)
                    setThreadMessage(null)
                }
                setChatAltered(true);
                return;
            }
            
            if (chat.type == "DM") {
                myMessageData.content = await decryptMessage(myMessageData.content, chat)
                if(myMessageData.parentMessage) {
                    const parent = {...myMessageData.parentMessage}
                    parent.content = await decryptMessage(parent.content, chat)
                    myMessageData.parentMessage = parent;
                }
            }
            
            try {
                await dbRef.current.insertMessageWrapper({ ...mapMessage(myMessageData), drafted: false })
                setMessageReceived(true)
                setChatAltered(true)
                SetReloadChats(true)
            } catch (error) {
                console.error(error)
            }

            try {
                if (messageData.sender.id !== user.id) {
                    messagesSocket.sendDeliverMessage({
                        messageId: messageData.id,
                        chatId: messageData.chatId
                    })
                }
            } catch (error) {
                console.error(error)
            }

            if (activeChat && activeChat.id === myMessageData.chatId) {
                try {
                    await loadMessages(activeChat.id)
                    messagesSocket.readAllMessages(activeChat.id)
                } catch (error) {
                    console.log(error)
                }
            } else {
                if (messageData.sender.id !== user.id) {
                    try {
                        await dbRef.current.updateUnreadCount(myMessageData.chatId, true)
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
            setMessageReceived(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeliverMessage = async (data) => {
        try {
            const activeChat = currentChatRef.current
            const localMessageIds = data.messageIds
            localMessageIds.map(async (messageId) => {
                try {
                    await dbRef.current.updateMessage(messageId, {
                        state: 1
                    })
                } catch (error) {
                    console.error(error)
                }
            })
            try {
                await dbRef.current.updateLastMessage(data.chatId, {
                    state: 1
                })
            } catch (error) {
                console.log(error)
            }

            if (activeChat && activeChat.id === data.chatId) {
                await loadMessages(activeChat.id)
            } else {
                await dbRef.current.updateUnreadCount(data.chatId, true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleReadMessage = async (data) => {
        try {
            const activeChat = currentChatRef.current
            const localMessageIds = data.messageIds
            localMessageIds.map(async (messageId) => {
                await dbRef.current.updateMessage(messageId, {
                    state: 2
                })
            })
            try {
                await dbRef.current.updateLastMessage(data.chatId, {
                    state: 2
                })
            } catch (error) {
                console.log(error)
            }
            if (activeChat && activeChat.id === data.chatId) {
                await loadMessages(activeChat.id)
            }
        } catch (error) {}
    }

    const handleReceiveEditMessage = async (messageData) => {
        try {
            const chat = await dbRef.current.getChat(messageData.chatId)
            let finalContent = messageData.content
            if (chat.type == "DM") {
                finalContent = await decryptMessage(messageData.content, chat)
            }
            await dbRef.current.updateMessage(messageData.id, {
                content: finalContent,
                edited: true
            })

            setMessages((prevMessages) => {
                return prevMessages.map((message) => {
                    if (message.id === messageData.id) {
                        return {
                            ...message,
                            content: finalContent,
                            edited: true
                        }
                    }
                    return message
                })
            })
            setChatAltered(true)
        } catch (error) {
            console.error(error)
        }
    }

    const handleReceiveDeleteMessage = async (deletedData) => {
        try {
            await dbRef.current.deleteMessage(deletedData.messages[0])
            setMessages((prevMessages) => {
                return prevMessages.filter((message) => message.id != deletedData.messages[0])
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handlePinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current
            const messagesForChat = await dbRef.current.getMessagesForChat(pinData.chatId)
            const messageToPin = messagesForChat.find((message) => message.id === pinData.id)

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.id} not found in chat ${pinData.chatId}`)
            }

            await dbRef.current.pinMessage({ ...pinData, content: messageToPin.content })
            await dbRef.current.updateMessagesForPinned(pinData.id)
            await loadMessages(activeChat.id)
            await loadPinnedMessages(activeChat.id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleUnpinMessage = async (pinData) => {
        try {
            const activeChat = currentChatRef.current
            const messagesForChat = await dbRef.current.getMessagesForChat(pinData.chatId)
            const messageToPin = messagesForChat.find((message) => message.id === pinData.id)

            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.id} not found in chat ${pinData.chatId}`)
            }
            try {
                await dbRef.current.unPinMessage(messageToPin.id)
            } catch (error) {
                throw error
            }

            try {
                await dbRef.current.updateMessagesForUnPinned(messageToPin.id)
            } catch (error) {
                throw error
            }

            await loadMessages(activeChat.id)
            await loadPinnedMessages(activeChat.id)
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        if (messagesSocket) {
            messagesSocket.onReceiveMessage(handleReceiveMessage)
            messagesSocket.onReceiveEditMessage(handleReceiveEditMessage)
            messagesSocket.onReceiveDeleteMessage(handleReceiveDeleteMessage)
            messagesSocket.onPinMessage(handlePinMessage)
            messagesSocket.onUnPinMessage(handleUnpinMessage)
            messagesSocket.onDeliverMessage(handleDeliverMessage)
            messagesSocket.onReadMessage(handleReadMessage)
        }

        return () => {
            messagesSocket.offReceiveMessage(handleReceiveMessage)
            messagesSocket.offReceiveEditMessage(handleReceiveEditMessage)
            messagesSocket.offReceiveDeleteMessage(handleReceiveDeleteMessage)
            messagesSocket.offPinMessage(handlePinMessage)
            messagesSocket.offUnPinMessage(handleUnpinMessage)
            messagesSocket.offDeliverMessage(handleDeliverMessage)
            messagesSocket.offReadMessage(handleReadMessage)
            messagesSocket.disconnect()
        }
    }, [messagesSocket])

    useEffect(() => {
        if (chatSocket) {
            chatSocket.onReceiveCreateChat(handleChatCreate)
            chatSocket.onReceiveLeaveChat(handleReceiveLeaveGroup)
            chatSocket.onReceiveAddAdmin(handleReceiveAddAdmin)
            chatSocket.onReceiveRemoveFromChat(handleReceiveRemoveFromChat)
            chatSocket.onReceiveAddUser(handleReceiveAddUser)
            chatSocket.onReceiveDeleteChat(handleReceiveDeleteChat)
        }
    }, [chatSocket])

    useEffect(() => {}, [messages, pinnedMessages])

    useEffect(() => {
        const loadSingleChat = async () => {
            if (chatAltered && currentChat) {
                try {
                    const updatedChat = await dbRef.current.getChat(currentChat.id)
                    setCurrentChat({...updatedChat})
                    setThreadMessage(null)
                    setIsThreadOpenned(false)
                    setChatAltered(false)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        loadSingleChat()
    }, [chatAltered])


    return (
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                messageReceived,
                pinnedMessages,
                chatAltered,
                threadMessage,
                setThreadMessage,
                setChatAltered,
                pinMessage,
                unPinMessage,
                leaveGroup,
                handleMute,
                handleUnMute,
                sendMessage,
                updateMessage,
                setIsThreadOpenned,
                sendJoinChat,
                searchChat,
                addAdmin,
                addUser,
                deleteChat,
                reloadChats,
                isThreadOpenned,
                SetReloadChats,
                parentMessage,
                updateParentMessage,
                clearParentMessage,
                deleteMessage,
                removeFromChat,
                sending,
                handleGetMembers,
                saveGroupSettings,
                handleGetGroupSettings,
                handleGetChannelSettings
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    return useContext(ChatContext)
}
