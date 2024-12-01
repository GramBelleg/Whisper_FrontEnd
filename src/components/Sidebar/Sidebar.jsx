import './Sidebar.css'
import { useSidebar } from "@/contexts/SidebarContext";
import ChatPage from "../ChatPage/ChatPage";
import ProfileSettingsPage from "@/pages/ProfileSettingsPage";
import { useEffect, useRef, useState } from "react";
import BlockedUsers from "../BlockedUsers/BlockedUsers";
import VisibilitySettings from "../VisibiltySettings/VisibilitySettings";
import SettingsPage from "@/pages/SettingsPage";

const pages = [
    {
      id: 'chat',
      Component: ChatPage,
    },
    {
        id: 'blocked_users',
        Component: BlockedUsers,
    },
    {
        id: 'visibility',
        Component: VisibilitySettings,
    },
    {
        id: 'profileSettings',
        Component: ProfileSettingsPage,
    },
    {
        id: 'settings',
        Component: SettingsPage,
    },
]

const Sidebar = () => {

    const { activePage } = useSidebar();
    const [sidebarWidth, setSidebarWidth] = useState(30); 
    const sidebarRef = useRef(null);

    const currentPage = pages.find(page => page.id === activePage) || pages[0];
    const Component = currentPage.Component;

    return (
        <div
            className="sidebar"
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}%`}}
        >
            <div className="sidebar__content">
                <Component />
            </div>
        </div>
    )
}

export default Sidebar;