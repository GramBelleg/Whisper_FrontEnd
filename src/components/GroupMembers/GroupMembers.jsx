import React, { useRef, useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import noUser from '../../assets/images/no-user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import useAuth from '@/hooks/useAuth';
import { useChat } from '@/contexts/ChatContext'
import './GroupMembers.css';
import { updateGroupMemberPermissions, updateChannelMemberPermissions } from '@/services/chatservice/updateChatMemberPermissions';

const GroupMembers = ({ filteredMembers, handleQueryChange, amIAdmin, handleAddAmin, handleRemoveFromChat, type }) => {
    const [menuState, setMenuState] = useState({
        isVisible: false,
        selectedUser: null, 
    });
    const { user } = useAuth();
    const { currentChat, handleGetMembersPermissions, handleGetSubscribersPermissions} = useChat();
    const [permissionsState, setPermissionsState] = useState({});
    useEffect(() => {
        const fetchPermissions = async () => {
            if (amIAdmin) {
                try {
                    let permissionsState;
                    if (type === 'group') {
                        permissionsState = await handleGetMembersPermissions();
                    }
                    else if (type === 'channel') {
                        permissionsState = await handleGetSubscribersPermissions();
                    }
                    else
                    {
                        console.log('Invalid type');
                        return;
                    }
                    console.log(permissionsState);

                    const initialState = {};
                    filteredMembers.forEach((member) => {
                        initialState[member.id] = permissionsState[member.id] || {};
                    });

                    setPermissionsState(initialState);
                    console.log(initialState);
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            }
        };

        fetchPermissions();
    }, [filteredMembers, amIAdmin, handleGetMembersPermissions]);
    const menuRef = useRef(null);

    const handleChevronClick = (event, member) => {
        event.stopPropagation(); 

        setMenuState({
            isVisible: !menuState.isVisible,
            selectedUser: member,  
        });
    };

    const handleCloseMenu = () => {
        setMenuState({ ...menuState, isVisible: false });
    };

    const handlePermissionsToggle = async (permission, memberId) => {
        const currentPermissions = permissionsState[memberId];
        console.log(currentPermissions);
        currentPermissions[permission] = !currentPermissions[permission];
        console.log(currentPermissions,"after");
        try {
            let response;
            if (type === 'group') {
                response = await updateGroupMemberPermissions(currentChat.id, memberId, currentPermissions);
            }
            else if (type === 'channel') {
                response = await updateChannelMemberPermissions(currentChat.id, memberId, currentPermissions);
            }
            setPermissionsState((prevState) => ({
                ...prevState,
                [memberId]: currentPermissions,
            }));
            console.log(response);
        }
        catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuState({ ...menuState, isVisible: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuState])
    if(type === 'channel' && !amIAdmin) return null;
    return (
        <div className='p-4 rounded-md' onClick={handleCloseMenu}>
            <h2 className='text-lg text-light text-left mb-6'>{type.charAt(0).toUpperCase() + type.slice(1)} {type === 'group' ? 'Members' : 'Subscribers'}</h2>
            <SearchBar handleQueryChange={handleQueryChange} className='pd-4' />

            <div className='members-list mg-4'>
                {filteredMembers?.map((member) => (
                    <div
                        key={member.id}
                        className='user-item'
                        style={{ position: 'relative' }} 
                    >
                        <div className='user-image'>
                            <img src={member.profilePic || noUser} alt={member.userName} />
                        </div>
                        <label htmlFor={`user-${member.id}`}>{member.userName || 'Unknown User'}</label>

                        {   
                            amIAdmin && !member.isAdmin && member.id !== user.id && <FontAwesomeIcon
                                icon={faChevronDown}
                                className='chevron-icon'
                                data-testid="chevron-icon"
                                onClick={(e) => handleChevronClick(e, member)} 
                                style={{ 
                                    cursor: 'pointer',
                                    marginLeft: "2%",
                                }}
                            />
                        }

                        {/* Member permissions button */}
                        {amIAdmin && !member.isAdmin && member.id !== user.id && (
                            <button 
                                className="permissions-btn"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent closing menu on click
                                    setMenuState({
                                        isVisible: !menuState.isVisible,
                                        selectedUser: member,
                                    });
                                }}
                            >
                            </button>
                        )}

                        {/* Permission checkboxes */}
                        {menuState.isVisible && menuState.selectedUser === member && (
                            <div
                                className="absolute top-full left-0 bg-[#081d3c] shadow-lg rounded-md z-50 mt-1 cursor-pointer text-white transition-all duration-300 ease-in-out"
                                ref={menuRef}
                            >
                            {   (type === 'group' || type === 'channel') && <div className="permission-checkboxes">
                            { type === 'group' && <div className="permission-box">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={permissionsState[member.id]?.canPost || false} 
                                        onChange={() => handlePermissionsToggle('canPost', member.id)} 
                                        data-testid="can-post"
                                    />
                                    Can Post
                                </label>
                            </div> }
                            { type === 'group' && <div className="permission-box">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={permissionsState[member.id]?.canEdit || false} 
                                        onChange={() => handlePermissionsToggle('canEdit', member.id)} 
                                        data-testid="can-edit"
                                    />
                                    Can Edit
                                </label>
                            </div> }
                            { type === 'group' && <div className="permission-box">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={permissionsState[member.id]?.canDelete || false} 
                                        onChange={() => handlePermissionsToggle('canDelete', member.id)} 
                                        data-testid="can-delete"
                                    />
                                    Can Delete
                                </label>
                            </div> }
                            <div className="permission-box">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={permissionsState[member.id]?.canDownload || false} 
                                        onChange={() => handlePermissionsToggle('canDownload', member.id)} 
                                        data-testid="can-download"
                                    />
                                    Can Download
                                </label>
                            </div>
                            { type === 'channel' && <div className="permission-box">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={permissionsState[member.id]?.canComment || false} 
                                        onChange={() => handlePermissionsToggle('canComment', member.id)} 
                                        data-testid="can-comment"
                                    />
                                    Can Comment
                                </label>
                            </div> }

                        </div>
                        }


                                <p className='w-full rounded-md hover:bg-[var(--accent-color)] hover:shadow-xl p-2' data-testid="promote-to-admin" onClick={() => handleAddAmin(member.id)}>Promote to admin</p>
                                <p className='w-full rounded-md hover:bg-[var(--accent-color)] hover:shadow-xl p-2' data-testid="remove-from-chat" onClick={() => handleRemoveFromChat(member)}>Remove from {type}</p>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupMembers;
