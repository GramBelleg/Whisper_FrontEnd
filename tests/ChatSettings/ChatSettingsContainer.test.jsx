import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ChatSettingsContainer from '@/components/ChatSettings/ChatSettingsContainer';
import { useChat } from '@/contexts/ChatContext';
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';

vi.mock('@/contexts/ChatContext', () => ({
    useChat: vi.fn(),
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
    useStackedNavigation: vi.fn(),
}));

describe('ChatSettingsContainer', () => {
    const saveChannelPrivacyMock = vi.fn();
    const handleGetChannelSettingsMock = vi.fn();
    const saveGroupSettingsMock = vi.fn();
    const handleGetGroupSettingsMock = vi.fn();
    const popMock = vi.fn();

    beforeEach(() => {
        useChat.mockReturnValue({
            saveChannelPrivacy: saveChannelPrivacyMock,
            handleGetChannelSettings: handleGetChannelSettingsMock,
            saveGroupSettings: saveGroupSettingsMock,
            handleGetGroupSettings: handleGetGroupSettingsMock,
        });

        useStackedNavigation.mockReturnValue({
            pop: popMock,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and displays channel settings', async () => {
        handleGetChannelSettingsMock.mockResolvedValue({ public: true });

        render(<ChatSettingsContainer chatType="channel" />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Public')).toBeInTheDocument();
        });
    });

    it('fetches and displays group settings', async () => {
        handleGetGroupSettingsMock.mockResolvedValue({ public: false, maxSize: 500 });

        render(<ChatSettingsContainer chatType="group" />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Private')).toBeInTheDocument();
            expect(screen.getByDisplayValue('500')).toBeInTheDocument();
        });
    });

    it('submits privacy changes for a channel', async () => {
        render(<ChatSettingsContainer chatType="channel" />);

        const privateRadio = screen.getByLabelText(/Public/i);
        await userEvent.click(privateRadio);
        expect(saveChannelPrivacyMock).not.toHaveBeenCalled();

        const submitButton = screen.getByTestId('save-privacy');
        await userEvent.click(submitButton);

        expect(saveChannelPrivacyMock).toHaveBeenCalledWith('Public');
    });

    it('submits privacy and limit changes for a group', async () => {
        render(<ChatSettingsContainer chatType="group" />);

        const limitInput = screen.getByRole('spinbutton');
        await userEvent.clear(limitInput);
        await userEvent.type(limitInput, '100');

        const saveLimitButton = screen.getByTestId('save-limit');
        await userEvent.click(saveLimitButton);

        expect(saveGroupSettingsMock).toHaveBeenCalledWith(100, null);
    });

    it('calls pop when the back button is clicked', async () => {
        render(<ChatSettingsContainer chatType="channel" />);

        const backButton = screen.getByTestId('back');
        await userEvent.click(backButton);

        expect(popMock).toHaveBeenCalled();
    });
});
