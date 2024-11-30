import SettingsContainer from '@/components/Settings/SettingsCotnainer'
import { StackedNavigationProvider } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
const SettingsPage = () => {
    return (
        <StackedNavigationProvider>
            <SettingsContainer />
        </StackedNavigationProvider>
    )
}

export default SettingsPage
