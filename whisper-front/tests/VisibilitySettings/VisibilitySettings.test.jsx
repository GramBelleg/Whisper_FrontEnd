import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VisibilitySettings from '@/components/VisibiltySettings/VisibilitySettings';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { whoAmI } from '@/services/chatservice/whoAmI';
import { putReadReceiptsSetting } from '@/services/privacy/privacy';


// Mock the putReadReceiptsSetting function
vi.mock('@/services/privacy/privacy', () => ({
  putReadReceiptsSetting: vi.fn().mockResolvedValue({ success: true }),
}));


describe('VisibilitySettings Component', () => {
    beforeEach(() => {
        render(
            <SidebarProvider>
              <ModalProvider>
                <VisibilitySettings />
              </ModalProvider>
            </SidebarProvider>
          );
    })
    it('renders component test', () => {
        expect(screen.getAllByText("Visibility Settings"))
    });

    it('shows all radio buttons default', () => {
        // Check profile picture visibility
        // Profile Picture Visibility radio buttons
        const profileEverybody = screen.getByTestId('profile-pic-visibiity-everybody');
        const profileContacts = screen.getByTestId('profile-pic-visibiity-contacts');
        const profileNoOne = screen.getByTestId('profile-pic-visibiity-noone');
        
        // Story Visibility radio buttons
        const storyEverybody = screen.getByTestId('story-visibility-everybody');
        const storyContacts = screen.getByTestId('story-visibility-contacts');
        const storyNoOne = screen.getByTestId('story-visibility-noone');
        
        // Last Seen Visibility radio buttons
        const lastSeenEverybody = screen.getByTestId('last-seen-everybody');
        const lastSeenContacts = screen.getByTestId('last-seen-contacts');
        const lastSeenNoOne = screen.getByTestId('last-seen-nooone');
        
        // Read Receipts toggle
        const readReceiptsToggle = screen.getByTestId('toggle-switch-test');

        // Check Profile Picture visibility
        if (whoAmI.profileVisibility === 'everybody') {
            expect(profileEverybody.checked).toBe(true);
        } else if (whoAmI.profileVisibility === 'contacts') {
            expect(profileContacts.checked).toBe(true);
        } else if (whoAmI.profileVisibility === 'no-one') {
            expect(profileNoOne.checked).toBe(true);
        }

        // Check Story visibility
        if (whoAmI.storySettings === 'everybody') {
            expect(storyEverybody.checked).toBe(true);
        } else if (whoAmI.storySettings === 'contacts') {
            expect(storyContacts.checked).toBe(true);
        } else if (whoAmI.storySettings === 'no-one') {
            expect(storyNoOne.checked).toBe(true);
        }

        // Check Last Seen visibility
        if (whoAmI.lastSeenVisibility === 'everybody') {
            expect(lastSeenEverybody.checked).toBe(true);
        } else if (whoAmI.lastSeenVisibility === 'contacts') {
            expect(lastSeenContacts.checked).toBe(true);
        } else if (whoAmI.lastSeenVisibility === 'no-one') {
            expect(lastSeenNoOne.checked).toBe(true);
        }
    });

    it('should update profile picture visibility when radio buttons are clicked', () => {
        
        const profileEverybody = screen.getByTestId('profile-pic-visibiity-everybody');
        const profileContacts = screen.getByTestId('profile-pic-visibiity-contacts');
        const profileNoOne = screen.getByTestId('profile-pic-visibiity-noone');
  
        // Change to contacts
        fireEvent.click(profileContacts);
        expect(profileContacts.checked).toBe(true);
        expect(profileEverybody.checked).toBe(false);
        expect(profileNoOne.checked).toBe(false);
  
        // Change to no-one
        fireEvent.click(profileNoOne);
        expect(profileNoOne.checked).toBe(true);
        expect(profileEverybody.checked).toBe(false);
        expect(profileContacts.checked).toBe(false);
  
        // Change back to everybody
        fireEvent.click(profileEverybody);
        expect(profileEverybody.checked).toBe(true);
        expect(profileContacts.checked).toBe(false);
        expect(profileNoOne.checked).toBe(false);
    });

    it('should update story visibility when radio buttons are clicked', () => {
        
        const storyEverybody = screen.getByTestId('story-visibility-everybody');
        const storyContacts = screen.getByTestId('story-visibility-contacts');
        const storyNoOne = screen.getByTestId('story-visibility-noone');
  
        // Change to contacts
        fireEvent.click(storyContacts);
        expect(storyContacts.checked).toBe(true);
        expect(storyEverybody.checked).toBe(false);
        expect(storyNoOne.checked).toBe(false);
  
        // Change to no-one
        fireEvent.click(storyNoOne);
        expect(storyNoOne.checked).toBe(true);
        expect(storyEverybody.checked).toBe(false);
        expect(storyContacts.checked).toBe(false);
  
        // Change back to everybody
        fireEvent.click(storyEverybody);
        expect(storyEverybody.checked).toBe(true);
        expect(storyContacts.checked).toBe(false);
        expect(storyNoOne.checked).toBe(false);
    });
    
    it('should update last seen visibility when radio buttons are clicked', () => {
        
        const lastSeenEverybody = screen.getByTestId('last-seen-everybody');
        const lastSeenContacts = screen.getByTestId('last-seen-contacts');
        const lastSeenNoOne = screen.getByTestId('last-seen-nooone');
  
        // Change to contacts
        fireEvent.click(lastSeenContacts);
        expect(lastSeenContacts.checked).toBe(true);
        expect(lastSeenEverybody.checked).toBe(false);
        expect(lastSeenNoOne.checked).toBe(false);
  
        // Change to no-one
        fireEvent.click(lastSeenNoOne);
        expect(lastSeenNoOne.checked).toBe(true);
        expect(lastSeenEverybody.checked).toBe(false);
        expect(lastSeenContacts.checked).toBe(false);
  
        // Change back to everybody
        fireEvent.click(lastSeenEverybody);
        expect(lastSeenEverybody.checked).toBe(true);
        expect(lastSeenContacts.checked).toBe(false);
        expect(lastSeenNoOne.checked).toBe(false);
    });

    it('should toggle read receipts when clicked', async () => {
        
        const readReceiptsToggle = screen.getByTestId('toggle-switch-test');
        const initialState = readReceiptsToggle.checked;
  
        // Toggle read receipts
        fireEvent.click(readReceiptsToggle);
        
        // Verify the API was called with the correct value
        expect(putReadReceiptsSetting).toHaveBeenCalledWith(!initialState);
        
        // Check that the toggle visual state has changed
        expect(readReceiptsToggle.checked).toBe(!initialState);
  
        // Toggle back
        fireEvent.click(readReceiptsToggle);
        expect(putReadReceiptsSetting).toHaveBeenCalledWith(initialState);
        expect(readReceiptsToggle.checked).toBe(initialState);
        
    });

    it('should handle read receipts toggle error', async () => {
        // Mock the API to throw an error
        vi.mocked(putReadReceiptsSetting).mockRejectedValueOnce(new Error('Toggle failed'));
        
        
        const readReceiptsToggle = screen.getByTestId('toggle-switch-test');
        const initialState = readReceiptsToggle.checked;
  
        // Try to toggle read receipts
        await fireEvent.click(readReceiptsToggle);
        
        // Check that the toggle state remains unchanged after error
        expect(readReceiptsToggle.checked).toBe(initialState);
    });
});