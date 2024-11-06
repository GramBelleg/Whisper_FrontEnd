import { render, screen, fireEvent } from '@testing-library/react';
import EditProfilePic from '@/components/ProfileSettings/ProfilePicture/EditProfilePic';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/hooks/useProfileSettings', () => ({
    useProfileSettings: vi.fn(),
}));
const openModal = vi.fn();
const closeModal = vi.fn();
vi.mock('@/contexts/ModalContext', () => ({
    useModal: () => ({
        openModal,
        closeModal
    }),
}));

describe('EditProfilePic', () => {
    const mockOnEdit = vi.fn();
    const mockOnAdd = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders default "NoProfile" image when no profile picture is available', () => {
        useProfileSettings.mockReturnValue({ profilePic: null });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const noProfileImage = screen.getByTestId('NoProfile');
        expect(noProfileImage).toBeInTheDocument();
        expect(screen.getByText('Add Profile Photo')).toBeInTheDocument();
    });

    it('renders the uploaded profile picture when available', () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        expect(profileImage).toHaveAttribute('src', testProfilePic);
    });

    it('shows "Change Profile Photo" on hover when a profile picture is present', async () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        fireEvent.mouseEnter(profileImage);

        expect(await screen.findByText('Change Profile Photo')).toBeInTheDocument();
    });

    it('opens photo options modal when profile picture is clicked', () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        fireEvent.click(profileImage);
        expect(openModal).toHaveBeenCalled();
    });

    it('clicking the component triggers on edit', () => {
        useProfileSettings.mockReturnValue({ profilePic: null });
        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);
    
        const profilePic = screen.getByText('Add Profile Photo');
    
        fireEvent.click(profilePic);
        expect(mockOnEdit).not.toHaveBeenCalled(); 
      });

});
