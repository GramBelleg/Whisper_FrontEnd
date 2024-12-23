
import CreateGroupPageContainer from '@/components/CreateGroupPageContainer/CreateGroupPageContainer'
import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
const CreateGroupPage = () => {
    return (
        <StackedNavigationProvider>
            <CreateGroupPageContainer/>
        </StackedNavigationProvider>
    )
}

export default CreateGroupPage
