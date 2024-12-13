import './AdminPage.css'
import AllUsers from '@/components/AllUsers/AllUsers'
import AllGroups from '@/components/AllGroups/AllGroups'
import { useSidebar } from '@/contexts/SidebarContext'
import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import { useEffect, useRef, useState } from 'react'
import AdminSettings from '@/components/AdminSettings/AdminSettings'
const pages = [
    {
        id: 'settings',
        Component: AdminSettings
    },
    {
        id: 'users',
        Component: AllUsers
    },
    {
        id: 'groups',
        Component: AllGroups
    },
]
const AdminContainer = () => {
    const { activePage } = useSidebar()
    const currentPage = pages.find((page) => page.id === activePage) || pages[0]
    const Component = currentPage.Component
    return (
        <div className='Dashboard'>
        <StackedNavigationProvider>

            <Component />
        </StackedNavigationProvider>
        </div>
    )
}

export default AdminContainer
