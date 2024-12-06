import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { mapMessage } from '@/services/chatservice/getMessagesForChat'
import MessagingSocket from '@/services/sockets/MessagingSocket'
import { useWhisperDB } from './WhisperDBContext'
import parentRelationshipTypes from '@/services/chatservice/parentRelationshipTypes'
import useAuth from '@/hooks/useAuth'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const [currentChat, setcurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [pinnedMessages, setPinnedMessages] = useState([])
    const [parentMessage, setParentMessage] = useState(null)
    const [sending, setSending] = useState(false)
    const messagesSocket = new MessagingSocket()
    const { dbRef } = useWhisperDB()
    const currentChatRef = useRef(currentChat)
    const [messageReceived, setMessageReceived] = useState(false)
    const [action, setAction] = useState(false)
    const [messageDelivered, setMessageDelivered] = useState(false)
    const { user } = useAuth()

    const setActionExposed = (actionIn) => {
        setAction(actionIn)
    }

    const selectChat = (chat) => {
        setcurrentChat(chat)
        setParentMessage(null)
    }

    const loadMessages = async (id) => {
        try {
            const myMessages = await dbRef.current.getMessagesForChat(id)
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
        messagesSocket.updateData({
            chatId: currentChat.id,
            id: messageId,
            content: content
        })
    }

    const deleteMessage = async (messageId) => {
        messagesSocket.deleteMessage({
            chatId: currentChat.id,
            messages: [messageId]
        })
    }

    const sendMessage = async (data) => {
        setSending(true)
        const newMessage = {
            chatId: currentChat.id,
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
            isAnnouncement: false,
            size: null,
            ...data
        }

        if (parentMessage && parentMessage.relationship === parentRelationshipTypes.REPLY) {
            newMessage.parentMessageId = parentMessage.id
        }

        const newMessageForBackend = { ...newMessage }

        ;(newMessage.senderId = user.userId), (newMessage.deliveredAt = '')
        newMessage.readAt = ''
        newMessage.deleted = false
        newMessage.sender = user.name
        newMessage.state = 4
        newMessage.time = new Date()

        try {
            messagesSocket.sendData(newMessageForBackend)
            setMessages((prevMessages) => {
                if (prevMessages) {
                    return [{ id: Date.now(), ...newMessage }, ...prevMessages]
                }
                return [newMessage]
            })
            setParentMessage(null)
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
        }
    }

    const updateParentMessage = (message, relationship) => {
        setParentMessage({ relationship, ...message })
    }

    const clearParentMessage = () => {
        setParentMessage(null)
    }

    const searchChat = async (query) => {
        try {
            if (currentChat) {
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

    const pinMessage = (messsageId, durtaion = 0) => {
        console.log("Pinning", {
            chatId: currentChat.id,
            id: messsageId
        })
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

    const handleReceiveMessage = async (messageData) => {
        try {
            const activeChat = currentChatRef.current
            const myMessageData = {
                ...messageData
            }
            try {
                await dbRef.current.insertMessageWrapper({ ...mapMessage(myMessageData), drafted: false })
                setMessageReceived(true)
                setAction(true)
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
            console.log(activeChat, ' ', data)
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
            await dbRef.current.updateMessage(messageData.messageId, {
                content: messageData.content,
                edited: true
            })

            setMessages((prevMessages) => {
                return prevMessages.map((message) => {
                    if (message.id === messageData.messageId) {
                        return {
                            ...message,
                            content: messageData.content,
                            edited: true
                        }
                    }
                    return message
                })
            })
            setMessageDelivered(true)
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
            console.log(pinData)
            const activeChat = currentChatRef.current
            const messagesForChat = await dbRef.current.getMessagesForChat(pinData.chatId)
            console.log("aywa")
            const messageToPin = messagesForChat.find((message) => message.id === pinData.id)
            console.log("aywa", messageToPin)
            if (!messageToPin) {
                throw new Error(`Message with id ${pinData.id} not found in chat ${pinData.chatId}`)
            }

            await dbRef.current.pinMessage({ ...pinData, content: messageToPin.content })
            await dbRef.current.updateMessagesForPinned(pinData.id)
            console.log("aywa", activeChat)
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
            messagesSocket.disconnect()
        }
    }, [messagesSocket])

    useEffect(() => {}, [messages, pinnedMessages])
    useEffect(() => {
        if (action) {
            setAction(false)
        }
    }, [action])

    useEffect(() => {
        if (messageDelivered) {
            setMessageDelivered(false)
        }
    }, [messageDelivered])


    return (
        <ChatContext.Provider
            value={{
                currentChat,
                selectChat,
                messages,
                messageReceived,
                pinnedMessages,
                action,
                messageDelivered,
                setActionExposed,
                pinMessage,
                unPinMessage,
                sendMessage,
                updateMessage,
                searchChat,
                parentMessage,
                updateParentMessage,
                clearParentMessage,
                deleteMessage,
                sending
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

// Create a custom hook to use the chat context
export const useChat = () => {
    return useContext(ChatContext)
}
