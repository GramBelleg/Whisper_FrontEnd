import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import ChatSearch from './ChatSearch'

const ChatSearchContainer = ({onClose}) => {
  return (
    <StackedNavigationProvider>
        <ChatSearch onClose={onClose}/>
    </StackedNavigationProvider>

  )
}

export default ChatSearchContainer
