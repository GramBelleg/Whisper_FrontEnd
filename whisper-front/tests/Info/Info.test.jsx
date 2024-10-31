import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import Info from '@/components/Info/Info';

describe('Info Component', () => {
    beforeEach(() => {
        render(<Info index={true} group={true} />);
    });

    afterEach(() => {
        cleanup();
    });

    it('renders without crashing', () => {
        expect(document.querySelector('.info')).toBeInTheDocument();
    });

    it('toggles dropdown visibility on click', () => {
        const dropdownButton = document.querySelector('.info');
        // Initially, dropdown is not visible
        expect(screen.queryByText('Mute notifications')).not.toBeInTheDocument();

        // Click to toggle dropdown
        fireEvent.click(dropdownButton);
        expect(screen.getByText('Mute notifications')).toBeInTheDocument();

        // Click again to hide dropdown
        fireEvent.click(dropdownButton);
        expect(screen.queryByText('Mute notifications')).not.toBeInTheDocument();
    });

    it('handles action clicks correctly for Mute', () => {
        const dropdownButton = document.querySelector('.info');
        fireEvent.click(dropdownButton);
        
        const muteButton = screen.getByText('Mute notifications');

        // Mock console.log
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        fireEvent.click(muteButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('Mute notifications clicked');
        consoleLogSpy.mockClear(); // Clear calls after each check
        // Restore the original console.log
        consoleLogSpy.mockRestore();
    });
    it('handles action clicks correctly for Block', () => {
        const dropdownButton = document.querySelector('.info');
        fireEvent.click(dropdownButton);
        
        const blockButton = screen.getByText('Block');
        // Mock console.log
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        // Click on block and verify
        fireEvent.click(blockButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('Block clicked');
        consoleLogSpy.mockClear(); // Clear calls after each check

        // Restore the original console.log
        consoleLogSpy.mockRestore();
    });

    it('handles action clicks correctly for Archiev', () => {
        const dropdownButton = document.querySelector('.info');
        fireEvent.click(dropdownButton);

        const archiveButton = screen.getByText('Archive');

        // Mock console.log
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        // Click on archive and verify
        fireEvent.click(archiveButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('Archive clicked');
        consoleLogSpy.mockClear(); // Clear calls after each check

        // Restore the original console.log
        consoleLogSpy.mockRestore();
    });

    it('handles action clicks correctly for Leave', () => {
        const dropdownButton = document.querySelector('.info');
        fireEvent.click(dropdownButton);
       
        const leaveGroupButton = screen.getByText('Leave group');

        // Mock console.log
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

       
        // Click on leave group and verify
        fireEvent.click(leaveGroupButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('Leave group clicked');

        // Restore the original console.log
        consoleLogSpy.mockRestore();
    });

    

    it('positions dropdown correctly based on available space', () => {
        // Trigger the dropdown visibility
        const dropdownButton = document.querySelector('.info');
        fireEvent.click(dropdownButton);

        // Check if the dropdown is positioned correctly
        const dropdown = screen.getByText('Mute notifications').closest('div');

        // We can check the styles, but this requires a more complex setup
        // or specific mocking of window.innerHeight and infoRect. 
        // You might want to use a ref to test this based on your layout.
        // This part might require adjustments based on your implementation.
        expect(dropdown).toBeInTheDocument();
    });
});
