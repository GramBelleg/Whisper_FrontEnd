import React, { useRef, useState, useEffect } from 'react'
import './Info.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useChat } from '@/contexts/ChatContext'

const Info = ({ id, index, group, isAdmin, muted, type }) => {
    const infoRef = useRef(null)
    const dropdownRef = useRef(null)
    const [dropdownPosition, setDropdownPosition] = useState('down')
    const [isVisible, setIsVisible] = useState(false)
    const { leaveGroup, handleMute, handleUnMute } = useChat()

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
            await handleMute(id, type)
        } catch (error) {
            console.error(error)
        }
    }

    const myHandleUnMute = async () => {
        try {
            await handleUnMute(id, type)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLeaveGroup = () => {
        leaveGroup(id)
    }

    const handleDeleteGroup = () => {
        // TODO: implement delete group
    }

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
                                {!muted ? (
                                    <li onClick={myHandleMute}>Mute notifications</li>
                                ) : (
                                    <li onClick={myHandleUnMute}>Unmute notifications</li>
                                )}
                                <li onClick={() => handleAction('Block')}>Block</li>
                                <li onClick={() => handleAction('Archive')}>Archive</li>
                                {group && (
                                    isAdmin ? (
                                        <li
                                            style={{ padding: '8px 12px', cursor: 'pointer', color: 'red' }}
                                            onClick={handleDeleteGroup}
                                        >
                                            Delete group
                                        </li>
                                    ) : (
                                        <li
                                            style={{ padding: '8px 12px', cursor: 'pointer', color: 'red' }}
                                            onClick={handleLeaveGroup}
                                        >
                                            Leave group
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
