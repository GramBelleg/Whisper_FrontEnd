import React, { useState, useRef, useEffect } from 'react'
import './AllGroups.css'
import { faArrowLeft, faFilter, faCheckCircle, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import axiosInstance from '@/services/axiosInstance'
import { readMedia } from '@/services/chatservice/media'
import { getBlobUrl } from '@/services/blobs/blob'
import { useWhisperDB } from '@/contexts/WhisperDBContext'

const AllGroups = ({ groups, setReload }) => {
    const { pop } = useStackedNavigation()
    const [groupList, setGroupList] = useState(() => {
        const uniqueGroups = Array.from(new Set(groups.map(g => g.id)))
            .map(id => groups.find(g => g.id === id))
            .map(group => ({
                ...group,
                objectLink: null,
                isLoading: false
            }));
        return uniqueGroups;
    });
    const [contextMenu, setContextMenu] = useState(null)
    const contextMenuRef = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { dbRef } = useWhisperDB()
    useEffect(() => {
        const fetchGroupsPics = async () => {
            const updatedGroups = await Promise.all(groupList.map(async (group) => {
                if (group.blobData)
                {
                    return { ...group, objectLink: URL.createObjectURL(group.blobData) }
                }
                if (!group.objectLink && group.picture) {
                    group.isLoading = true;
                    const blobData = await fetchProfilePicture(group);
                    await dbRef.current.updateGroup(group.chatId, {
                        blobData: blobData
                    })
                    const imageUrl = URL.createObjectURL(blobData)
                    group.isLoading = false;
                    return { ...group, objectLink: imageUrl };
                }
                return group;
            }));

            setGroupList(updatedGroups);
        };

        fetchGroupsPics();
    }, []);

    const fetchProfilePicture = async (group) => {
        try {
            let response = await getBlobUrl(group.picture)
            if (response.error) {
                console.error('Failed to fetch group picture', error);
                return null;
            }
            return response.blob
        } catch (error) {
            console.error('Failed to fetch group picture', error);
            return null;
        }
    }

    const handleGoBack = () => {
        setReload(true)
        pop()
    }

    const handleContextMenu = (e, group) => {
        e.preventDefault()
        setContextMenu({
            group,
            x: e.clientX,
            y: e.clientY
        })
    }

    const handleToggleGroupFilter = async (groupId, isFiltering) => {
        try {
            await axiosInstance.put(
                `/api/admin/filter/${isFiltering}/group/${groupId}`,
                {
                    withCredentials: true
                }
            )
            if (isFiltering) {
                await dbRef.current.filterGroup(groupId)
            }
            else {
                await dbRef.current.unFilterGroup(groupId)
            }
            setGroupList(prevGroups =>
                prevGroups.map(u =>
                    u.chatId === groupId ? { ...u, filter: isFiltering } : u
                )
            )
            setContextMenu(null)
        } catch (error) {
            console.error(`${isFiltering ? 'Filter' : 'Unfilter'} failed`, error)
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

    const filteredGroups = searchTerm 
        ? groupList.filter(group => 
            group.name.toLowerCase().startsWith(searchTerm.toLowerCase())
          )
        : groupList

    return (
        <div 
            className='all-groups'
            data-testid='test-all-groups-page'
            onClick={handleClickOutside}
        >
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon 
                    data-testid='back-icon'
                    className='back-icon'
                    icon={faArrowLeft}
                    onClick={handleGoBack}
                />
                <h1>All Groups</h1>
            </div>
            
            <div className='search-container'>
                <FontAwesomeIcon icon={faSearch} className='search-icon' />
                <input 
                    type='text' 
                    placeholder='Search groups...'
                    className='search-input'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className='group-list'>
                {filteredGroups.map(group => (
                    <div
                        key={group.chatId}
                        className='group-item'
                        onContextMenu={(e) => handleContextMenu(e, group)}
                    >
                        {group.objectLink ? (
                            <img
                                src={group.objectLink}
                                alt={group.name}
                                className='group-avatar'
                            />
                        ) : (
                            <div className='group-avatar placeholder'>
                                {group.isLoading && (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                )}
                            </div>
                        )}
                        <div className='group-details'>
                            <span className='group-name'>{group.name}</span>
                        </div>
                        {group.filter && <span className='filtered-badge'>Content Filtered</span>}
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
                        onClick={() => handleToggleGroupFilter(contextMenu.group.chatId, !contextMenu.group.filter)}
                        className={`filter-button ${contextMenu.group.filter ? 'unfilter' : 'filter'}`}
                    >
                        <FontAwesomeIcon icon={contextMenu.group.filter ? faCheckCircle : faFilter} /> 
                        {contextMenu.group.filter ? 'Remove Filter' : 'Filter Content'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllGroups