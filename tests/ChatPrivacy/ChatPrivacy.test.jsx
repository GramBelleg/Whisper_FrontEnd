import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPrivacy from '@/components/ChatPrivacy/ChatPrivacy';

describe('ChatPrivacy', () => {
    const mockHandlePrivacyChange = vi.fn();
    const mockHandlePrivacySubmit = vi.fn();

    beforeEach(() => {
        render(
            <ChatPrivacy
                privacy="Public"
                title="Channel Settings"
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
            />
        );
    });

    it('renders the title', () => {
        expect(screen.getByText(/Channel Settings/i)).toBeInTheDocument();
    });

    it('renders the radio buttons with correct labels', () => {
        expect(screen.getByLabelText(/Public/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Private/i)).toBeInTheDocument();
    });

    it('checks the correct radio button based on the privacy prop', () => {
        const publicRadio = screen.getByLabelText(/Public/i);
        const privateRadio = screen.getByLabelText(/Private/i);

        expect(publicRadio).toBeChecked();
        expect(privateRadio).not.toBeChecked();
    });

    it('calls handlePrivacyChange when a radio button is selected', async () => {
        const privateRadio = screen.getByLabelText(/Private/i);
        await userEvent.click(privateRadio);

        expect(mockHandlePrivacyChange).toHaveBeenCalled();
    });

    it('calls handlePrivacySubmit when the Save button is clicked', async () => {
        const saveButton = screen.getByTestId('save-privacy');
        await userEvent.click(saveButton);

        expect(mockHandlePrivacySubmit).toHaveBeenCalled();
    });
});
