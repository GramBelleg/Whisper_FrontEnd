import { render, screen, fireEvent } from '@testing-library/react';
import EditProfilePic from './EditProfilePic';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/hooks/useProfileSettings', () => ({
    useProfileSettings: vi.fn(),
}));

describe('EditProfilePic', () => {
    const mockOnEdit = vi.fn();
    const mockOnAdd = vi.fn();

    beforeEach(() => {

        vi.clearAllMocks();
    });

    it('renders NoProfile image when no profile picture is available', () => {
        useProfileSettings.mockReturnValue({ profilePic: null });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const noProfileImage = screen.getByAltText('Profile');
        expect(noProfileImage).toBeInTheDocument();
    });

    it('renders the profile picture when it is available', () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        expect(profileImage).toHaveAttribute('src', testProfilePic);
    });

    it('displays "Edit Photo" when a profile picture is present and hovered', async () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        
        fireEvent.mouseEnter(profileImage);
        
        expect(await screen.findByText('Edit Photo')).toBeInTheDocument();
    });

    it('displays "Add Photo" when no profile picture is present and hovered', async () => {
        useProfileSettings.mockReturnValue({ profilePic: null });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const noProfileImage = screen.getByAltText('Profile');
        
        fireEvent.mouseEnter(noProfileImage);
        
        expect(await screen.findByText('Add Photo')).toBeInTheDocument();
    });

    it('calls onEdit when the profile picture is clicked', () => {
        const testProfilePic = 'http://example.com/profile.jpg';
        useProfileSettings.mockReturnValue({ profilePic: testProfilePic });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const profileImage = screen.getByAltText('Profile');
        
        fireEvent.click(profileImage);
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onAdd when no profile picture is clicked', () => {
        useProfileSettings.mockReturnValue({ profilePic: null });

        render(<EditProfilePic onEdit={mockOnEdit} onAdd={mockOnAdd} />);

        const noProfileImage = screen.getByAltText('Profile');
        
        fireEvent.click(noProfileImage);
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
});
