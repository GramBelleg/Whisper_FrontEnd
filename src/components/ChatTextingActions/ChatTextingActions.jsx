import { useEffect, useRef, useState } from 'react'
import './ChatTextingActions.css'
import CustomEmojisPicker from '../CustomEmojisPicker/CustomEmojisPicker'
import mentionStyle from '../ChatActions/mentionStyle'
import classNames from './mention.module.css'
import { Mention, MentionsInput } from 'react-mentions'
import { useChat } from '@/contexts/ChatContext'

const ChatTextingActions = ({ textMessage, setTextMessage, triggerSendMessage }) => {
    // const textareaRef = useRef(null)
    const { handleGetMembers, currentChat} = useChat()
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // Prevents new line from being added
            triggerSendMessage()
        }
    }

    const [members, setMembers] = useState([])

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await handleGetMembers()
                setMembers(response.map((member) => ({ id: member.id, display: member.userName })))
            } catch (error) {
                console.error('Error fetching members:', error)
            }
        }

        if (currentChat && currentChat.type === 'GROUP') {
            getMembers()
        }
    }, [currentChat])


    

    const handleEmojiClick = (emojiObject) => {
        setTextMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    const updateNewMessage = (event) => {
        const value = event.target.value
        setTextMessage(value)
    }

    return (
        <>
            <div className='emojis-container'>
                <CustomEmojisPicker handleEmojiClick={handleEmojiClick} />
            </div>
            <MentionsInput
                        markup="@[__display__](user:__id__)"
                        value={textMessage}
                        data-testid='text-input'
                        onChange={updateNewMessage}
                        forceSuggestionsAboveCursor={true}
                        onKeyDown={handleKeyPress}
                        placeholder={"Message Here"}
                        className="mentions"
                        classNames={classNames}
                        a11ySuggestionsListLabel={'Suggested mentions'}
                    >
                    <Mention
                    markup="@[__display__](user:__id__)"
                    displayTransform={(id, dipslay) => `@${dipslay}`}
                    trigger="@"
                    data={members}
                    renderSuggestion={(suggestion, search, highlightedDisplay) => (
                        <div className="user">{highlightedDisplay}</div>
                    )}
                    style={mentionStyle}
                    />
                </MentionsInput>

            {/* <textarea
                type='text'
                ref={textareaRef}
                value={textMessage}
                onInput={updateNewMessage}
                onKeyDown={handleKeyPress}
                data-testid='text-input'
                className='message-input'
                placeholder='Message Here'
                rows={1}
            /> */}
        </>
    )
}

export default ChatTextingActions
