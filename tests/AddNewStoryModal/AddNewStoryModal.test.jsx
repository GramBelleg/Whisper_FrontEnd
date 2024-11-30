import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AddNewStoryModal from './AddNewStoryModal';
import { ModalProvider } from '@/contexts/ModalContext';
import { uploadBlob } from '@/services/blobs/blob';
import { addNewStory } from '@/services/storiesservice/addNewStory';
import userEvent from '@testing-library/user-event';

// Mock services
vi.mock('@/services/blobs/blob', () => ({
    uploadBlob: vi.fn(),
}));

vi.mock('@/services/storiesservice/addNewStory', () => ({
    addNewStory: vi.fn(),
}));

// Mock file and preview
const mockFile = new File(['mock file'], 'mock.png', { type: 'image/png' });
const mockFilePreview = 'data:image/png;base64,previewData';

describe('AddNewStoryModal', () => {
    beforeEach(() => {
        // Reset mocks and default responses
        uploadBlob.mockResolvedValue('mockBlobName');
        addNewStory.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const renderWithModalProvider = (props) =>
        render(
            <ModalProvider>
                <AddNewStoryModal
                    file={mockFile}
                    filePreview={mockFilePreview}
                    onClose={props.onClose}
                    onStoryAdded={props.onStoryAdded}
                />
            </ModalProvider>
        );

    it('renders the modal with file preview and input elements', () => {
        renderWithModalProvider({
            onClose: vi.fn(),
            onStoryAdded: vi.fn(),
        });

        expect(screen.getByAltText('Story Preview')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Message Here')).toBeInTheDocument();
    });

    it('calls uploadBlob and addNewStory on sendStory', async () => {
        const onClose = vi.fn();
        const onStoryAdded = vi.fn();

        renderWithModalProvider({ onClose, onStoryAdded });

        const textarea = screen.getByPlaceholderText('Message Here');
        const sendButton = screen.getByRole('button', { name: /send/i });

        await userEvent.type(textarea, 'Test story');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(uploadBlob).toHaveBeenCalledWith(mockFile, expect.any(String));
            expect(addNewStory).toHaveBeenCalledWith(expect.objectContaining({
                content: 'Test story',
                media: expect.any(String),
                type: mockFile.type,
            }));
        });

        expect(onStoryAdded).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('shows loading spinner while sending story', async () => {
        uploadBlob.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve('mockBlobName'), 100))
        );

        renderWithModalProvider({
            onClose: vi.fn(),
            onStoryAdded: vi.fn(),
        });

        const sendButton = screen.getByRole('button', { name: /send/i });
        fireEvent.click(sendButton);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('displays an error modal on failure', async () => {
        const error = new Error('Upload failed');
        uploadBlob.mockRejectedValue(error);

        renderWithModalProvider({
            onClose: vi.fn(),
            onStoryAdded: vi.fn(),
        });

        const sendButton = screen.getByRole('button', { name: /send/i });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(error.message)).toBeInTheDocument();
        });
    });

    it('resets story text on cancel', async () => {
        renderWithModalProvider({
            onClose: vi.fn(),
            onStoryAdded: vi.fn(),
        });

        const textarea = screen.getByPlaceholderText('Message Here');
        const cancelButton = screen.getByRole('button', { name: /cancel/i });

        await userEvent.type(textarea, 'Some story text');
        expect(textarea.value).toBe('Some story text');

        fireEvent.click(cancelButton);
        expect(textarea.value).toBe('');
    });
});
