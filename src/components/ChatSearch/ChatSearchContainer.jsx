import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import ChatSearch from './ChatSearch'

const ChatSearchContainer = ({onClose, handleSearchMessageClick}) => {
  return (
    <StackedNavigationProvider>
        <ChatSearch onClose={onClose} handleSearchMessageClick={handleSearchMessageClick}/>
    </StackedNavigationProvider>

  )
}

export default ChatSearchContainer
