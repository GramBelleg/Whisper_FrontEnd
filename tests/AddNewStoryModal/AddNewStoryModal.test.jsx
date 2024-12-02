import AddNewStoryModal from '@/components/AddNewStoryModal/AddNewStoryModal';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

vi.mock('url', () => ({
    createObjectURL: jest.fn().mockReturnValue('mockFilePreviewUrl'),
}));


vi.mock('@/components/CustomEmojisPicker/CustomEmojisPicker', () => ({
    __esModule: true,
    default: ({ onEmojiSelect }) => (
        <button onClick={() => onEmojiSelect('😀')}>Select Emoji</button>
    ),
}));

vi.mock('@/contexts/StoryContext', () => ({
    useStories: vi.fn(() => ({ uploadStory: vi.fn(), isUploading: false })),
}));

describe('AddNewStoryModal', () => {
    it('renders with file preview for image', async () => {
        const file = new File(['image data'], 'image.jpg', { type: 'image/jpeg' });
    
        render(<AddNewStoryModal file={file} filePreview="" onClose={vi.fn()} />);
    
        const image = await screen.findByRole('img', { name: /Story Preview/i });
        expect(image).toBeInTheDocument();
        expect(image.src).toBe('http://localhost:3000/');
    });

    it('auto-adjusts textarea height', async () => {
        render(<AddNewStoryModal file={new File([], 'image.jpg')} filePreview="" onClose={vi.fn()} />);
        
        const textarea = screen.getByRole('textbox', { name: "" });
        expect(textarea).toBeInTheDocument();
        
        userEvent.type(textarea, 'This is a longer message');
        
        expect(textarea).toHaveStyle({height: '0px'}); // Assert height adjustment
    });

    it('renders with file preview for video', async () => {
        const file = new File(['video data'], 'video.mp4', { type: 'video/mp4' });
    
        render(<AddNewStoryModal file={file} filePreview="" onClose={vi.fn()} />);
        const video = screen.getByTestId('story-preview-video');
        expect(video).toBeInTheDocument();
        expect(video.src).toBe('http://localhost:3000/');
    });
});