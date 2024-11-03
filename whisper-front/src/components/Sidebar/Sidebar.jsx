import { useSidebar } from "@/contexts/SidebarContext";
import ChatPage from "../ChatPage/ChatPage";
import { useEffect, useRef, useState } from "react";
import './Sidebar.css'
import BlockedUsers from "../BlockedUsers/BlockedUsers";
import VisibilitySettings from "../VisibiltySettings/VisibilitySettings";


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
    }
]

const Sidebar = () => {

    const { activePage } = useSidebar();
    const [sidebarWidth, setSidebarWidth] = useState(30); 
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);

    const startResizing = () => {
        isResizing.current = true;
    };

    const stopResizing = () => {
        isResizing.current = false;
    };

    const resize = (e) => {
        if (isResizing.current) {
            const newWidth = (e.clientX / window.innerWidth) * 100; 
            if (newWidth >= 20 && newWidth <= 45) {
                setSidebarWidth(newWidth);
            }
        }
    };

    const currentPage = pages.find(page => page.id === activePage) || pages[0];
    const Component = currentPage.Component;


    useEffect(() => {
        const handleMouseUp = stopResizing;
        const handleMouseMove = resize;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            className="sidebar"
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}%` }}
        >
            <Component />
            <div
                className="sidebar__resizer"
                onMouseDown={startResizing}
            />
        </div>
    )
}

export default Sidebar