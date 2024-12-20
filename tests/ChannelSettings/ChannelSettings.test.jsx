import { render, fireEvent, screen } from '@testing-library/react';
import ChannelSettings from '@/components/ChannelSettings/ChannelSettings';
import { describe, it, vi, expect, beforeAll } from 'vitest';
import { useChat } from '@/contexts/ChatContext';
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';

vi.mock('@/contexts/ChatContext', () => ({
    useChat: vi.fn(),
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
    useStackedNavigation: vi.fn(),
}));

describe('ChannelSettings', () => {
    const mockPop = vi.fn();
    const mockSaveChannelPrivacy = vi.fn();

    beforeAll(() => {
        useStackedNavigation.mockReturnValue({ pop: mockPop });
        useChat.mockReturnValue({ saveChannelPrivacy: mockSaveChannelPrivacy });
    });

    it('renders with initial privacy set to "Public"', () => {
        render(<ChannelSettings  />);
        expect(screen.getByText('Channel Settings')).toBeInTheDocument();
        expect(screen.getByTestId('public')).toBeInTheDocument();
        expect(screen.getByTestId('private')).toBeInTheDocument();
    });


    it('allows changing privacy from "Public" to "Private"', () => {
        render(<ChannelSettings initialPrivacy="Public" />);
        const privateRadio = screen.getByLabelText('Private');

        fireEvent.click(privateRadio);

        expect(privateRadio.checked).toBe(true);
        expect(screen.getByLabelText('Public').checked).toBe(false);
    });

    it('calls saveChannelPrivacy when "Save" is clicked', async () => {
        render(<ChannelSettings initialPrivacy="Public" />);
        const saveButton = screen.getByTestId('save-privacy');

        fireEvent.click(screen.getByLabelText('Private')); 
        fireEvent.click(saveButton);

        expect(mockSaveChannelPrivacy).toHaveBeenCalledWith('Private');
    });

    it('calls pop when back button is clicked', () => {
        render(<ChannelSettings initialPrivacy="Public" />);
        const backButton = screen.getByTestId('back');

        fireEvent.click(backButton);

        expect(mockPop).toHaveBeenCalled();
    });
});
