import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChannelSettings from '@/components/ChannelSettings/ChannelSettings';

describe('ChannelSettings', () => {
    const mockHandlePrivacyChange = vi.fn();
    const mockHandlePrivacySubmit = vi.fn();

    beforeEach(() => {
        render(
            <ChannelSettings
                privacy="Public"
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
            />
        );
    });

    it('renders the title "Channel Settings"', () => {
        expect(screen.getAllByText(/Channel Settings/i)[0]).toBeInTheDocument();
    });

    it('renders the ChatPrivacy component', () => {
        expect(screen.getByText(/Public/i)).toBeInTheDocument();
        expect(screen.getByText(/Private/i)).toBeInTheDocument();
    });

    it('calls handlePrivacyChange when a privacy option is selected', async () => {
        const privateRadio = screen.getByTestId('private');
        await userEvent.click(privateRadio);

        expect(mockHandlePrivacyChange).toHaveBeenCalled();
    });

    it('calls handlePrivacySubmit when the Save button is clicked', async () => {
        const saveButton = screen.getByTestId('save-privacy');
        await userEvent.click(saveButton);

        expect(mockHandlePrivacySubmit).toHaveBeenCalled();
    });
});
