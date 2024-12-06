import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PinnedMessages.css'
import { faThumbtack, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useChat } from '@/contexts/ChatContext'

const PinnedMessages = ({ onGoToMessage }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const { pinnedMessages, unPinMessage } = useChat()

    const handleNextMessage = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length)
    }

    const handlePreviousMessage = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? pinnedMessages.length - 1 : prevIndex - 1))
    }

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev)
    }

    const handleUnpin = () => {
        unPinMessage(pinnedMessages[activeIndex].messageId)

        const newActiveIndex = activeIndex >= pinnedMessages.length - 1 ? pinnedMessages.length - 2 : activeIndex

        setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0)
        setIsDropdownOpen(false)
    }

    const handleGoToMessage = () => {
        onGoToMessage(pinnedMessages[activeIndex])
        setIsDropdownOpen(false)
    }

    useEffect(() => {}, [pinnedMessages])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className='pinned-messages-container'>
            <div className='indicators-container'>
                {pinnedMessages?.map((pinned, index) => (
                    <div key={index} data-message-id={`${pinned.messageId}`} className={`pinned indicator ${activeIndex === index ? 'indicator-active' : 'indicator-inactive'}`}></div>
                ))}
            </div>

            <div
                className='pinned-messages'
                onClick={(e) => {
                    if (!dropdownRef.current || !dropdownRef.current.contains(e.target)) {
                        handleNextMessage()
                    }
                }}
                onContextMenu={(e) => {
                    e.preventDefault() 
                    handlePreviousMessage()
                }}
            >
                <FontAwesomeIcon icon={faThumbtack} style={{ height: '24px' }} className='icon-pin' />
                <div className='messages-list'>
                    <div className='pinned-message'>
                        <p className='message-content' title={pinnedMessages[activeIndex]?.content}>
                            {pinnedMessages[activeIndex]?.content}
                        </p>
                    </div>
                </div>

                <div
                    className='dropdown-container'
                    ref={dropdownRef}
                    onClick={(e) => e.stopPropagation()} // Prevent bubbling to the parent container
                >
                    <FontAwesomeIcon icon={faChevronDown} className='dropdown-icon' onClick={toggleDropdown} />
                    {isDropdownOpen && (
                        <div className='dropdown-menu'>
                            <button onClick={handleUnpin}>Unpin</button>
                            <button onClick={handleGoToMessage}>Go to Message</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PinnedMessages
