import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileContainer from '@/components/ProfileSettings/ProfileContainer';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuth from '@/hooks/useAuth';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useModal } from '@/contexts/ModalContext';
import ModalVerify from '@/components/ProfileSettings/ModalVerify';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useProfileSettings');
vi.mock('@/contexts/ModalContext');
vi.mock('@/components/ProfileSettings/ModalVerify', () => ({
  __esModule: true,
  default: vi.fn(() => <div />), // Mock ModalVerify component
}));

describe('ProfileContainer', () => {
    const mockUser = {
        bio: 'Initial bio',
        name: 'Initial name',
        userName: 'initial_username',
        email: 'initial@example.com',
        phoneNumber: '1234567890',
    };

    const mockHandleBioUpdate = vi.fn();
    const mockHandleNameUpdate = vi.fn();
    const mockHandleUserNameUpdate = vi.fn();
    const mockHandlePhoneUpdate = vi.fn();
    const mockHandleSendUpdateCode = vi.fn().mockResolvedValue(true); // Default to success
    const mockHandleResendUpdateCode = vi.fn();
    const mockOpenModal = vi.fn();
    const mockCloseModal = vi.fn();
    const mockClearError = vi.fn();
    const mockErrors = {
        bio: null,
        name: null,
        userName: null,
        email: null,
        phoneNumber: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ user: mockUser });
        useProfileSettings.mockReturnValue({
            handleBioUpdate: mockHandleBioUpdate,
            handleNameUpdate: mockHandleNameUpdate,
            handleUserNameUpdate: mockHandleUserNameUpdate,
            handlePhoneUpdate: mockHandlePhoneUpdate,
            handleSendUpdateCode: mockHandleSendUpdateCode,
            handleResendUpdateCode: mockHandleResendUpdateCode,
            errors: mockErrors,
            clearError: mockClearError,
        });
        
        // Here we mock useModal to return a mock of openModal and closeModal
        useModal.mockReturnValue({
            openModal: mockOpenModal,
            closeModal: mockCloseModal, // Mock closeModal as well
        });

        render(<ProfileContainer />);
    });

    it('opens ModalVerify when email is updated', async () => {
        const pendingEmail = 'new-email@example.com';
        
        fireEvent.click(screen.getByTestId("button-edit-email"));
        fireEvent.change(screen.getByTestId("email"), { target: { value: pendingEmail } });
        const saveButton = screen.getByTestId("button-save-edit");
        fireEvent.click(saveButton);
        await waitFor(() => expect(mockHandleSendUpdateCode).toHaveBeenCalledWith(pendingEmail));
        await waitFor(() => expect(mockOpenModal).toHaveBeenCalled());
    });
    
    it('renders EditableField for Bio with initial text', () => {
        const bioField = screen.getByTestId("bio");
        expect(bioField).toBeInTheDocument();
        expect(bioField).toHaveTextContent(mockUser.bio);
    });

    it('renders EditableField for Name with initial text', () => {
        const nameField = screen.getByTestId("name");
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveTextContent(mockUser.name);
    });

    it('renders EditableField for User Name with initial text', () => {
        const userNameField = screen.getByTestId("userName");
        expect(userNameField).toBeInTheDocument();
        expect(userNameField).toHaveTextContent(mockUser.userName);
    });

    it('renders EditableField for Email with initial text', () => {
        const emailField = screen.getByTestId("email");
        expect(emailField).toBeInTheDocument();
        expect(emailField).toHaveTextContent(mockUser.email);
    });

    it('renders EditablePhoneField for Phone Number with initial text', () => {
        const phoneField = screen.getByTestId("phoneNumber");
        expect(phoneField).toBeInTheDocument();
        expect(phoneField).toHaveTextContent(mockUser.phoneNumber);
    });

    it('allows editing the Bio field and saves changes', async () => {
        fireEvent.click(screen.getByTestId("button-edit-bio"));
        const bioField = screen.getByTestId("bio");
        fireEvent.change(bioField, { target: { value: 'Updated bio' } });

        const saveButton = screen.getByTestId("button-save-edit");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockHandleBioUpdate).toHaveBeenCalledWith('Updated bio');
            expect(mockClearError).toHaveBeenCalledWith('bio');
        });
    });

    it('allows editing the Name field and saves changes', async () => {
        fireEvent.click(screen.getByTestId("button-edit-name"));
        const nameField = screen.getByTestId("name");
        fireEvent.change(nameField, { target: { value: 'Updated name' } });

        const saveButton = screen.getByTestId("button-save-edit");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockHandleNameUpdate).toHaveBeenCalledWith('Updated name');
            expect(mockClearError).toHaveBeenCalledWith('name');
        });
    });

    it('allows editing the User Name field and saves changes', async () => {
        fireEvent.click(screen.getByTestId("button-edit-userName"));
        const userNameField = screen.getByTestId("userName");
        fireEvent.change(userNameField, { target: { value: 'new_username' } });

        const saveButton = screen.getByTestId("button-save-edit");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockHandleUserNameUpdate).toHaveBeenCalledWith('new_username');
            expect(mockClearError).toHaveBeenCalledWith('userName');
        });
    });

    it('allows editing the Phone Number field and saves changes', async () => {
        fireEvent.click(screen.getByTestId("button-edit-phoneNumber"));
        const phoneField = screen.getByRole('textbox', { 'data-testid': "phone-phoneNumber" });

        fireEvent.change(phoneField, { target: { value: '0987654321' } });

        const saveButton = screen.getByTestId("button-save-edit");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockHandlePhoneUpdate).toHaveBeenCalledWith('+0987654321');
            expect(mockClearError).toHaveBeenCalledWith('phoneNumber');
        });
    });
});
