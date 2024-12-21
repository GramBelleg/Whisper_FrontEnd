import AdminContainer from '@/components/Admin/AdminContainer'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ModalProvider } from '@/contexts/ModalContext'
import ButtonsBar from '@/components/ButtonsBar/ButtonsBar'
const AdminPage = () => {
    return (
        <ModalProvider>
            <div className='Dashboard'>
                <SidebarProvider>
                    <div className='buttons-bar-container'>
                        <ButtonsBar />
                    </div>
                    <AdminContainer />
                </SidebarProvider>
            </div>
        </ModalProvider>
    )
}

export default AdminPage
