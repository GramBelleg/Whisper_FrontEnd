import './ButtonsBar.css'
import Bookmark from '../../assets/images/bookmark.svg?react'
import Chat from '../../assets/images/chat.svg?react'
import Settings from '../../assets/images/settings.svg?react'
import Starred from '../../assets/images/starred.svg?react'
import Stories from '../../assets/images/stories.svg?react'
import LogoutButton from '../auth/Logout/LogoutButton'
import { useSidebar } from '@/contexts/SidebarContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ProfilePic from '../ProfileSettings/ProfilePicture/ProfilePic'

const ButtonsBar = () => {
    const handleClick = (iconName) => {
        console.log(`${iconName} clicked`)
    }

    const { setActivePage } = useSidebar()

    const toggleProfileSettings = () => {
        console.log('toggleProfileSettings')
        setActivePage('profileSettings')
    }

    return (
        <div className='icon-column'>
            <div onClick={() => setActivePage('chat')} className='icon-container'>
                <Chat data-testid='chat-icon' className='icon' />
            </div>
            <div onClick={() => handleClick('Bookmark')} className='icon-container'>
                <Bookmark data-testid='bookmark-icon' className='icon' />
            </div>
            <div onClick={() => handleClick('Starred')} className='icon-container'>
                <Starred data-testid='starred-icon' className='icon' />
            </div>
            <div onClick={() => handleClick('Stories')} className='icon-container'>
                <Stories data-testid='stories-icon' className='icon' />
            </div>
            <LogoutButton />
            <div className='profile-pic-container'>
                <ProfilePic handleClick={toggleProfileSettings} />
            </div>
            <div onClick={() => setActivePage('settings')} className='icon-container settings-icon'>
                <Settings data-testid='settings-icon' className='icon' />
            </div>
        </div>
    )
}

export default ButtonsBar
