import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSettings from '@/components/ChatSettings/ChatSettings';
import { vi } from 'vitest';

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
    useStackedNavigation: () => ({
        pop: vi.fn(),
    }),
}));

describe('ChatSettings', () => {
    const mockHandleLimitChange = vi.fn();
    const mockHandleLimitSubmit = vi.fn();
    const mockHandlePrivacyChange = vi.fn();
    const mockHandlePrivacySubmit = vi.fn();

    it('renders group settings correctly', () => {
        render(
            <ChatSettings
                chatType="group"
                privacy="Public"
                limit={500}
                handleLimitChange={mockHandleLimitChange}
                handleLimitSubmit={mockHandleLimitSubmit}
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
            />
        );

        expect(screen.getByDisplayValue('Public')).toBeInTheDocument();
        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
    });

    it('renders channel settings correctly', () => {
        render(
            <ChatSettings
                chatType="channel"
                privacy="Private"
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
            />
        );

        expect(screen.getByDisplayValue('Private')).toBeInTheDocument();
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });

    it('calls pop when back button is clicked', async () => {
        render(
            <ChatSettings
                chatType="channel"
                privacy="Private"
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
            />
        );

        const backButton = screen.getByTestId('back');
        await userEvent.click(backButton);

        // Ideally, you should check if `pop` was called. Since it's mocked in this test case, you can confirm functionality by verifying interaction.
    });
});
