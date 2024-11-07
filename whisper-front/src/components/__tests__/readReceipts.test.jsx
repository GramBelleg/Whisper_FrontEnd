import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VisibilitySettings from '../VisibiltySettings/VisibilitySettings';
import { useSidebar } from '@/contexts/SidebarContext';
import { useModal } from '@/contexts/ModalContext';
import { putReadReceiptsSetting } from "@/services/privacy/privacy";
import { whoAmI } from '../../services/chatservice/whoAmI';
import { vi } from 'vitest';
import { SidebarProvider } from '@/contexts/SidebarContext';

vi.mock('@/contexts/SidebarContext', () => ({
    useSidebar: vi.fn(),
}));

vi.mock('@/contexts/ModalContext', () => ({
    useModal: vi.fn(),
}));

vi.mock('@/contexts/SidebarContext', () => ({
    useSidebar: vi.fn(),
    SidebarProvider: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../services/chatservice/whoAmI', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    whoAmI: {
      readReceipts: true,
      profileVisibility: 'everybody',
      storySettings: 'everybody',
      lastSeenVisibility: 'everybody',
    }
  };
});
vi.mock('@/services/privacy/privacy', () => ({
    putReadReceiptsSetting: vi.fn(),
}));

describe('VisibilitySettings Component', () => {
    let openModal, closeModal;

    beforeEach(() => {
        openModal = vi.fn();
        closeModal = vi.fn();

        useModal.mockReturnValue({
            openModal,
            closeModal,
        });

        useSidebar.mockReturnValue({
            setActivePage: vi.fn(),
        });
    });

    it('renders read receipts toggle switch with correct initial state', () => {
    
        render(       
            <SidebarProvider>
                <VisibilitySettings />
            </SidebarProvider>
            );

        const readReceiptsToggle = screen.getByTestId("toggleReadReceipts");
        expect(readReceiptsToggle).toBeInTheDocument();
        expect(readReceiptsToggle.checked).toBe(true);
    });

    it('toggles read receipts setting when clicked', async () => {
        putReadReceiptsSetting.mockResolvedValueOnce({});
        render(       
            <SidebarProvider>
                <VisibilitySettings />
            </SidebarProvider>
            );

        const readReceiptsToggle = screen.getByTestId("toggleReadReceipts");

        fireEvent.click(readReceiptsToggle);

        await waitFor(() => {
            expect(putReadReceiptsSetting).toHaveBeenCalledWith(false);
            expect(readReceiptsToggle.checked).toBe(false);
        });
    });

    it('displays error modal on failed update of read receipts', async () => {
        putReadReceiptsSetting.mockRejectedValueOnce(new Error("Failed to update"));
        render(       
            <SidebarProvider>
                <VisibilitySettings />
            </SidebarProvider>
            );
        const readReceiptsToggle = screen.getByTestId("toggleReadReceipts");
        fireEvent.click(readReceiptsToggle);
        await waitFor(() => {
            expect(openModal).toHaveBeenCalled();
        });
    });
});
