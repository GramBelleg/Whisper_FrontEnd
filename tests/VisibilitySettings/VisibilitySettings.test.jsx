// VisibilitySettings.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { putLastSeenVisibilitySettings, putProfilePicVisibilitySettings, putReadReceiptsSetting, putStoriesVisibilitySettings } from "@/services/privacy/privacy";
import VisibilitySettings from '@/components/VisibiltySettings/VisibilitySettings';

vi.mock('@/hooks/useAuth', () => ({
    default: () => ({
        user: { 
            name: 'CurrentUser', 
            pfpPrivacy: "Everyone",
            storyPrivacy:'Everyone',
            lastSeenPrivacy: 'Everyone',
            readReceipts: false
        }, 
        handleUpdateUser: vi.fn()
    }),
}));

vi.mock('@/services/privacy/privacy', () => ({
    putLastSeenVisibilitySettings: vi.fn(),
    putProfilePicVisibilitySettings: vi.fn(),
    putReadReceiptsSetting: vi.fn(),
    putStoriesVisibilitySettings: vi.fn(),
}));

vi.mock('@/contexts/ModalContext', () => ({
    useModal: vi.fn(() => ({
        openModal: vi.fn(),
        closeModal: vi.fn(),
    })),
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
    useStackedNavigation: vi.fn(() => ({
        pop: vi.fn(),
    })),
}));

describe('VisibilitySettings Component', () => {
    beforeEach(() => {
        render(<VisibilitySettings />);
    });

    it('renders Visibility Settings header', () => {
        expect(screen.getByText('Visibility Settings')).toBeInTheDocument();
    });

    it('renders profile picture visibility options with initial state', () => {
        expect(screen.getByTestId('profile-pic-visibiity-Everyone')).toBeChecked();
        expect(screen.getByTestId('profile-pic-visibiity-Contacts')).not.toBeChecked();
        expect(screen.getByTestId('profile-pic-visibiity-noone')).not.toBeChecked();
    });

    it('updates profile picture visibility setting when a new option is selected', async () => {
        const contactsOption = screen.getByTestId('profile-pic-visibiity-Contacts');
        fireEvent.click(contactsOption);
        expect(putProfilePicVisibilitySettings).toHaveBeenCalledWith('Contacts');
        expect(screen.getByTestId('profile-pic-visibiity-Contacts')).toBeChecked();
    });

    it('renders story visibility options with initial state', () => {
        expect(screen.getByTestId('story-visibility-Everyone')).toBeChecked();
        expect(screen.getByTestId('story-visibility-Contacts')).not.toBeChecked();
        expect(screen.getByTestId('story-visibility-noone')).not.toBeChecked();
    });
    
    it('renders last seen visibility options with initial state', () => {
        expect(screen.getByTestId('last-seen-Everyone')).toBeChecked();
        expect(screen.getByTestId('last-seen-Contacts')).not.toBeChecked();
        expect(screen.getByTestId('last-seen-nooone')).not.toBeChecked();
    });

    it('updates last seen visibility setting when a new option is selected', async () => {
        const contactsOption = screen.getByTestId('last-seen-Contacts');
        fireEvent.click(contactsOption);
        expect(putLastSeenVisibilitySettings).toHaveBeenCalledWith('Contacts');
        expect(screen.getByTestId('last-seen-Contacts')).toBeChecked();
    });

    it('renders read receipts toggle with initial state', () => {
        const toggle = screen.getByTestId('toggle-switch-test');
        expect(toggle).not.toBeChecked();
    });

    it('toggles read receipts setting when the switch is clicked', async () => {
        const toggle = screen.getByTestId('toggle-switch-test');
        fireEvent.click(toggle);
        setTimeout(() => {
            expect(putReadReceiptsSetting).toHaveBeenCalledWith(false);
            expect(toggle).not.toBeChecked();
        }, [5000])
        
    });
});
