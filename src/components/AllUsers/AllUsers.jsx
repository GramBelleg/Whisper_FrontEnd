import React, { useState, useRef, useEffect } from 'react'
import './AllUsers.css'
import { faArrowLeft, faBan, faSpinner, faCheckCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import axiosInstance from '@/services/axiosInstance'
import { readMedia } from '@/services/chatservice/media'
import { getBlobUrl } from '@/services/blobs/blob'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import { toggleUserBan } from '@/services/adminservice/adminActions'

const AllUsers = ({ users, setReload}) => {

    const { pop } = useStackedNavigation()
    const [userList, setUserList] = useState(() => {
        const uniqueUsers = Array.from(new Set(users.map(u => u.id)))
            .map(id => users.find(u => u.id === id))
            .map(user => ({
                ...user,
                objectLink: null,
                isLoading: false
            }));
        return uniqueUsers;
    });
    const [contextMenu, setContextMenu] = useState(null)
    const contextMenuRef = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { dbRef } = useWhisperDB()

    useEffect(() => {
        const fetchUserProfilePics = async () => {
            const updatedUsers = await Promise.all(userList.map(async (user) => {
                if (user.blobData)
                {   
                    return { ...user, objectLink: URL.createObjectURL(user.blobData) }
                }
                if (!user.objectLink && user.profilePic) {
                    user.isLoading = true;
                    const blobData = await fetchProfilePicture(user);
                    await dbRef.current.updateUser(user.id, {
                        blobData: blobData
                    })
                    const imageUrl = URL.createObjectURL(blobData)
                    user.isLoading = false;
                    return { ...user, objectLink: imageUrl };
                }
                return user;
            }));

            setUserList(updatedUsers);
        };

        fetchUserProfilePics();
    }, []);

    const fetchProfilePicture = async (user) => {
        try {
            let response = await getBlobUrl(user.profilePic)
            if (response.error) {
                console.error('Failed to fetch profile picture', error);
                return null;
            }
            return response.blob
        } catch (error) {
            console.error('Failed to fetch profile picture', error);
            return null;
        }
    }

    const handleGoBack = () => {
        setReload(true)
        pop()
    }

    const handleContextMenu = (e, user) => {
        e.preventDefault()
        setContextMenu({
            user,
            x: e.clientX,
            y: e.clientY
        })
    }

    const handleToggleUserBan = async (userId, isBanning) => {
        try {
            let status = toggleUserBan(userId, isBanning);
            if (!status) {
                return;
            }
            if (isBanning) {
                await dbRef.current.banUser(userId)
            }
            else {
                await dbRef.current.unBanUser(userId)
            }
            setUserList(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId ? { ...u, ban: isBanning } : u
                )
            )
            setContextMenu(null)
        } catch (error) {
            console.error(`${isBanning ? 'Ban' : 'Unban'} failed`, error)
        }
    }

    const handleClickOutside = (e) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
            setContextMenu(null)
        }
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const filteredUsers = searchTerm 
        ? userList.filter(user => 
            user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
          )
        : userList

    return (
        <div 
            className='all-users'
            data-testid='test-all-users-page'
            onClick={handleClickOutside}
        >
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon 
                    data-testid='back-icon'
                    className='back-icon'
                    icon={faArrowLeft}
                    onClick={handleGoBack}
                />
                <h1>All Users</h1>
            </div>
            
            <div className='search-container'>
                <FontAwesomeIcon icon={faSearch} className='search-icon' />
                <input 
                    type='text' 
                    placeholder='Search users...'
                    className='search-input'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className='user-list'>
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className='user-item'
                        onContextMenu={(e) => handleContextMenu(e, user)}
                    >
                        {user.objectLink ? (
                            <img
                                src={user.objectLink}
                                alt={user.name}
                                className='user-avatar'
                            />
                        ) : (
                            <div className='user-avatar placeholder'>
                                {user.isLoading && (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                )}
                            </div>
                        )}
                        <div className='user-details'>
                            <span className='user-name'>{user.name}</span>
                            <span className='user-email'>{user.email}</span>
                        </div>
                        {user.ban && <span data-testid ='banned-badge' className='banned-badge'>Banned</span>}
                    </div>
                ))}
            </div>

            {contextMenu && (
                <div
                    ref={contextMenuRef}
                    className='context-menu'
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x
                    }}
                >
                    <button
                        data-testid='toggle-ban-button'
                        onClick={() => handleToggleUserBan(contextMenu.user.id, !contextMenu.user.ban)}
                        className={`ban-button ${contextMenu.user.ban ? 'unban' : 'ban'}`}
                    >
                        <FontAwesomeIcon icon={contextMenu.user.ban ? faCheckCircle : faBan} /> 
                        {contextMenu.user.ban ? 'Unban User' : 'Ban User'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllUsers