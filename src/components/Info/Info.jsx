import React, { useRef, useState, useEffect } from 'react'
import './Info.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useChat } from '@/contexts/ChatContext'

const Info = ({index,  myChat }) => {
    const infoRef = useRef(null)
    const dropdownRef = useRef(null)
    const [dropdownPosition, setDropdownPosition] = useState('down')
    const [isVisible, setIsVisible] = useState(false)
    const { leaveGroup, handleMute, handleUnMute, deleteChat } = useChat()

    const toggleDropdown = () => {
        setIsVisible(!isVisible)
    }

    const handleAction = (action) => {
        console.log(`${action} clicked`)
        // TODO: Handle the action here (Mute, Pin, Block, Archive, Leave)
    }

    const handlePositioning = () => {
        const infoRect = infoRef.current.getBoundingClientRect()
        const dropdownHeight = dropdownRef.current ? dropdownRef.current.offsetHeight : 0
        const spaceBelow = window.innerHeight - infoRect.bottom
        const spaceAbove = infoRect.top

        if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
            setDropdownPosition('up') 
        } else {
            setDropdownPosition('down') 
        }
    }

    const myHandleMute = async () => {
        try {
            await handleMute(myChat.id, myChat.type)
        } catch (error) {
            console.error(error)
        }
    }

    const myHandleUnMute = async () => {
        try {
            await handleUnMute(myChat.id, myChat.type)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLeaveGroup = () => {
        leaveGroup(myChat.id)
    }

    const handleDeleteGroup = () => {
        deleteChat(myChat.id)
    }

    useEffect(() => {
        setIsVisible(false)
    }, [])
    useEffect(() => {
        if (isVisible) {
            handlePositioning()
        }
        const handleResize = () => {
            if (isVisible) handlePositioning()
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [isVisible])


    return (
        <>
            {index && (
                <div className='info' ref={infoRef} onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faChevronDown} style={{ color: 'grey' }} />
                    {isVisible && (
                        <div
                            className='dropdown' 
                            onMouseLeave={() => {
                                setIsVisible(false)
                            }}
                            ref={dropdownRef}
                            style={{
                                top: dropdownPosition === 'down' ? '100%' : 'auto',
                                bottom: dropdownPosition === 'up' ? '100%' : 'auto'
                            }}
                        >
                            <ul>
                                {!myChat.isMuted ? (
                                    <li onClick={myHandleMute}>Mute notifications</li>
                                ) : (
                                    <li onClick={myHandleUnMute}>Unmute notifications</li>
                                )}
                                {myChat.type !== "DM" && (
                                    myChat.isAdmin ? (
                                        <li
                                            style={{ padding: '8px 12px', cursor: 'pointer', color: 'red' }}
                                            onClick={handleDeleteGroup}
                                        >
                                            Delete {myChat.type.toLowerCase()}
                                        </li>
                                    ) : (
                                        <li
                                            style={{ padding: '8px 12px', cursor: 'pointer', color: 'red' }}
                                            onClick={handleLeaveGroup}
                                        >
                                            Leave {myChat.type.toLowerCase()}
                                        </li>
                                    ) 
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Info
