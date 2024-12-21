import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserGroup, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import useAuth from '@/hooks/useAuth'
import AllGroups from '../AllGroups/AllGroups'
import AllUsers from '../AllUsers/AllUsers'
import axiosInstance from '@/services/axiosInstance'
import { mockUsers } from '@/services/mock/mockData'
import { mockGroups } from '@/services/mock/mockData'
import { useWhisperDB } from '@/contexts/WhisperDBContext'
import { useCallback } from 'react'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import './AdminSettings.css'
const AdminSettings = () => {
    const [reload , setReload] = useState(false)
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { dbRef } = useWhisperDB()
    const { push, pop, stack } = useStackedNavigation()
    const { user } = useAuth()
    const { openModal, closeModal } = useModal()

    const loadData = useCallback(async () => {
        try {
            let allUsers = await dbRef.current.getUsersAdminStore()
            setUsers(allUsers)
            let allGroups = await dbRef.current.getGroups()
            setGroups(allGroups)
            console.log(allUsers, allGroups)
            setLoading(false)
            console.log("norrr")
        } catch (error) {
            console.log("err")
            openModal(<ErrorMesssage errorMessage={error.message} appearFor={3000} onClose={closeModal} />)
        }
    }, [dbRef, openModal, closeModal])

    useEffect(() => {
        if (dbRef.current || reload) {
            loadData()
            console.log("loaded")
            setReload(false)
        }
    }, [dbRef, loadData, reload])
    const handleUsersClick = () => {
        push(<AllUsers users={users} setReload={setReload}/>)
    }


    const handleGroupsClick = () => {
        push(<AllGroups groups={groups} setReload={setReload}/>)
    }

    if (loading) return (
        <div className='admin loading' data-testid='test-admin-page'>
            <FontAwesomeIcon icon={faCircleNotch} spin size='2x' className='loading-icon' />
        </div>
    )

    if (error) return (
        <div className='admin error' data-testid='test-admin-page'>
            Error loading admin data
        </div>
    )


    return (
        <div className='admin' data-testid='test-admin-page'>
            <div className='list-container'>
                <h2 className='subtitle'>Admin Dashboard</h2>

                <div className='item' onClick={handleUsersClick} data-testid='all-users-icon'>
                    <FontAwesomeIcon icon={faUser} className='list-item-icon' />
                    <span>Users ({users.length})</span>
                </div>
                <div className='item' onClick={handleGroupsClick} data-testid='all-groups-icon'>
                    <FontAwesomeIcon icon={faUserGroup} className='list-item-icon' />
                    <span>Groups ({groups.length})</span>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
