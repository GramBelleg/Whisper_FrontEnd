// VisibilitySettings.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { whoAmI } from '@/services/chatservice/whoAmI';
import { putLastSeenVisibilitySettings, putProfilePicVisibilitySettings, putReadReceiptsSetting, putStoriesVisibilitySettings } from "@/services/privacy/privacy";
import { useModal } from "@/contexts/ModalContext";
import { useStackedNavigation } from "@/contexts/StackedNavigationContext/StackedNavigationContext";
import VisibilitySettings from '@/components/VisibiltySettings/VisibilitySettings';

// Mock dependencies
vi.mock('@/services/chatservice/whoAmI', () => ({
    whoAmI: {
        storyPrivacy: 'Contacts',
        pfpPrivacy: 'Everyone',
        lastSeenPrivacy: 'Nobody',
        readReceipts: true,
    },
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
        expect(screen.getByTestId('story-visibility-Everyone')).not.toBeChecked();
        expect(screen.getByTestId('story-visibility-Contacts')).toBeChecked();
        expect(screen.getByTestId('story-visibility-noone')).not.toBeChecked();
    });

    it('updates story visibility setting when a new option is selected', async () => {
        const everyoneOption = screen.getByTestId('story-visibility-Everyone');
        fireEvent.click(everyoneOption);
        expect(putStoriesVisibilitySettings).toHaveBeenCalledWith('Everyone');
        expect(screen.getByTestId('story-visibility-Everyone')).toBeChecked();
    });

    it('renders last seen visibility options with initial state', () => {
        expect(screen.getByTestId('last-seen-Everyone')).not.toBeChecked();
        expect(screen.getByTestId('last-seen-Contacts')).not.toBeChecked();
        expect(screen.getByTestId('last-seen-nooone')).toBeChecked();
    });

    it('updates last seen visibility setting when a new option is selected', async () => {
        const contactsOption = screen.getByTestId('last-seen-Contacts');
        fireEvent.click(contactsOption);
        expect(putLastSeenVisibilitySettings).toHaveBeenCalledWith('Contacts');
        expect(screen.getByTestId('last-seen-Contacts')).toBeChecked();
    });

    it('renders read receipts toggle with initial state', () => {
        const toggle = screen.getByTestId('toggle-switch-test');
        expect(toggle).toBeChecked();
    });

    it('toggles read receipts setting when the switch is clicked', async () => {
        const toggle = screen.getByTestId('toggle-switch-test');
        fireEvent.click(toggle);
        expect(putReadReceiptsSetting).toHaveBeenCalledWith(false);
        expect(toggle).not.toBeChecked();
    });
});
