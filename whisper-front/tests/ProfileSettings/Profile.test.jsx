import { render, screen, fireEvent } from '@testing-library/react';
import ProfileContainer from './ProfileContainer';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProfileContainer', () => {
    const mockOnSave = vi.fn();

    beforeEach(() => {
        render(<ProfileContainer />);
    });

    it('renders profile settings heading', () => {
        const headingElement = screen.getByText(/Profile Settings/i);
        expect(headingElement).toBeInTheDocument();
    });

    it('renders EditableField for Bio with initial text', () => {
        const bioField = screen.getByLabelText(/Bio/i);
        expect(bioField).toBeInTheDocument();
    });

    it('renders EditableField for Name with initial text', () => {
        const nameField = screen.getByLabelText(/Name/i);
        expect(nameField).toBeInTheDocument();
    });



    it('allows editing the Bio field and saves changes', () => {
        const bioField = screen.getByLabelText(/Bio/i);
        const editButton = screen.getByRole('button', { name: /edit/i });
        const saveButton = screen.getByRole('button', { name: /save/i }); 
        fireEvent.click(editButton);

        // Change the input value
        fireEvent.change(bioField, { target: { value: 'Updated bio' } });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith('Updated bio');
    });

});
